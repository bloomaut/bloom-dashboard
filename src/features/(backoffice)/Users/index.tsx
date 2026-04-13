"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, ChevronLeft, ChevronRight, Search, Users, Calendar, Mail, User, Eye } from "lucide-react";
import styles from "./styles.module.css";

// service helpers
import { getAllUsers, getWishListUsers } from "@/services/userFetch";

// fallback mapping for fields coming from the API to the shape used by the UI
function normalizeUser(u: any) {
  const email = String(u.email ?? u.emailAddress ?? "").trim();
  const rawName = typeof u.name === "string" ? u.name.trim() : u.name;
  const rawLastname = typeof u.lastname === "string" ? u.lastname.trim() : u.lastname;
  const fullName = `${rawName ?? ""} ${rawLastname ?? ""}`.trim();
  const emailFallbackName = email ? email.split("@")[0] : "";

  const onboardingStatus = (u.onboarding_status ??
    u.onboardingStatus ??
    u.onboarding?.status ??
    u.client?.onboarding_status ??
    u.client?.onboardingStatus ??
    null) as string | null;

  const wishList = Boolean(u.wish_list ?? u.wishList ?? u.client?.wish_list ?? u.client?.wishList ?? false);
  const active = u.active === undefined || u.active === null ? true : Boolean(u.active);
  const roleRaw = String(u.role ?? u.roleName ?? "default").trim();
  const role =
    roleRaw === "default"
      ? "Usuario"
      : roleRaw === "admin"
        ? "Admin"
        : roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1);

  const status = (() => {
    if (!active) return "inactivo";
    if (wishList) return "lista-espera";
    if (onboardingStatus === "ONBOARDING_REJECTED") return "rechazado";
    if (["ONBOARDING_COMPLETED", "BRAND_COMPLETED", "SOCIAL_CONNECTED"].includes(String(onboardingStatus)))
      return "onboarding-completado";
    return "onboarding-en-progreso";
  })();

  return {
    id: u.id ?? u._id ?? u.userId,
    name: fullName || emailFallbackName || "Sin nombre",
    email: email || "-",
    role,
    roleRaw,
    registrationDate: u.registrationDate ?? u.created_at ?? u.createdAt ?? null,
    lastLogin: u.lastLogin ?? u.last_login ?? null,
    status,
    onboardingStatus,
    wishList,
    suscription: u.suscription ?? u.subscription ?? null,
    raw: u,
  };
}

function formatOnboardingStatus(status: string | null): string {
  if (!status) return "-";
  switch (status) {
    case "FIRST_LOGIN":
      return "Primer ingreso";
    case "TERMS_ACCEPTED":
      return "Términos aceptados";
    case "BRAND_PROCESSING":
      return "Procesando marca";
    case "BRAND_COMPLETED":
      return "Marca completada";
    case "SOCIAL_CONNECTED":
      return "Redes conectadas";
    case "ONBOARDING_COMPLETED":
      return "Onboarding completado";
    case "ONBOARDING_REJECTED":
      return "Onboarding rechazado";
    default:
      return status;
  }
}

export default function UserManagement() {
  const { locale } = useParams() as { locale: string };
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // choose API function according to the selected filter
  const chooseFetcher = (filter: string) => {
    switch (filter) {
      case "lista-espera":
        return getWishListUsers;
      case "todos":
      default:
        return getAllUsers;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const fetcher = chooseFetcher(statusFilter);
      try {
        const res = await fetcher(currentPage, usersPerPage);
        let items: any[] = [];
        let total: number | null = null;

        if (Array.isArray(res)) {
          items = res;
        } else {
          items =
            res?.data?.result?.users?.items ??
            res?.result?.users?.items ??
            res?.users?.items ??
            res?.items ??
            res?.data ??
            [];

          total =
            res?.data?.result?.users?.total ??
            res?.result?.users?.total ??
            res?.users?.total ??
            res?.total ??
            res?.count ??
            res?.meta?.total ??
            null;
        }

        const normalized = (items || []).map(user => normalizeUser(user));
        if (!mounted) return;
        setUsers(normalized);
        setTotalUsers(
          typeof total === "number" ? total : total ? Number(total) || normalized.length : normalized.length,
        );
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Error al cargar usuarios");
        setUsers([]);
        setTotalUsers(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [statusFilter, currentPage, usersPerPage]);

  // Filter users by search term
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusFilteredUsers =
    statusFilter === "todos" ? filteredUsers : filteredUsers.filter(u => String(u.status) === statusFilter);

  // compute pagination UI values from totalUsers
  const totalPages = totalUsers ? Math.max(1, Math.ceil(totalUsers / usersPerPage)) : 1;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lista-espera":
        return <Badge className={styles.badgeBlue}>En Lista de Espera</Badge>;
      case "onboarding-completado":
        return <Badge className={styles.badgeEmerald}>Onboarding Completado</Badge>;
      case "onboarding-en-progreso":
        return <Badge className={styles.badgeSlate}>Onboarding en Progreso</Badge>;
      case "rechazado":
        return <Badge className={styles.badgeRed}>Rechazado</Badge>;
      case "inactivo":
        return <Badge className={styles.badgeMuted}>Inactivo</Badge>;
      default:
        return (
          <Badge variant='outline' className='font-medium'>
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className={`${styles.root}`}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Users className={styles.headerIconSvg} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>Gestión de Usuarios</h1>
              <p className={styles.headerSubtitle}>Administra y supervisa todos los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className={styles.filtersCard}>
          <CardHeader className={styles.filtersHeader}>
            <CardTitle className={styles.filtersTitle}>
              <Filter className={styles.filtersTitleIcon} />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.filtersContent}>
              {/* Search Input */}
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <Input
                  placeholder='Buscar por nombre o email...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className={styles.selectFilter}>
                  <SelectValue placeholder='Filtrar por estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los estados</SelectItem>
                  <SelectItem value='lista-espera'>En Lista de Espera</SelectItem>
                  <SelectItem value='onboarding-en-progreso'>Onboarding en Progreso</SelectItem>
                  <SelectItem value='onboarding-completado'>Onboarding Completado</SelectItem>
                  <SelectItem value='rechazado'>Rechazado</SelectItem>
                  <SelectItem value='inactivo'>Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className={styles.usersCard}>
          <CardHeader className={styles.usersHeader}>
            <div className={styles.usersHeaderContent}>
              <CardTitle className={styles.usersTitle}>
                Lista de Usuarios ({totalUsers ?? statusFilteredUsers.length}{" "}
                {(totalUsers ?? statusFilteredUsers.length) === 1 ? "usuario" : "usuarios"})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className={styles.usersContent}>
            {/* Mobile Cards View */}
            <div className={styles.mobileView}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    Cargando usuarios...
                  </div>
                </div>
              ) : statusFilteredUsers.length === 0 ? (
                <div className={styles.emptyContainer}>
                  {error ? (
                    <div className={styles.errorMessage}>{error}</div>
                  ) : (
                    <div className={styles.emptyMessage}>
                      {searchTerm
                        ? "No se encontraron usuarios que coincidan con la búsqueda."
                        : "No se encontraron usuarios."}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.userCardsList}>
                  {statusFilteredUsers.map(user => (
                    <div key={user.id} className={styles.userCard}>
                      <div className={styles.userCardContent}>
                        <div className={styles.userCardInfo}>
                          <div className={styles.userCardHeader}>
                            <div className={styles.userCardIcon}>
                              <User className={styles.userCardIconSvg} />
                            </div>
                            <h3 className={styles.userCardName}>{user.name}</h3>
                          </div>

                          <div className={styles.userCardDetails}>
                            <div className={styles.userCardDetail}>
                              <Mail className={styles.userCardDetailIcon} />
                              <span className={styles.userCardDetailText}>{user.email}</span>
                            </div>

                            <div className={styles.userCardDetail}>
                              <Calendar className={styles.userCardDetailIcon} />
                              <span>{formatDate(user.registrationDate)}</span>
                            </div>

                            <div className={styles.userCardMetaRow}>
                              {getStatusBadge(user.status)}
                              <Badge className={styles.badgeRole}>{user.role}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className={styles.userCardActions}>
                          <Link href={`/${locale}/backoffice/users/${user.id}`}>
                            <Button variant='ghost' size='sm' className={styles.userCardButton}>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className={styles.desktopView}>
              <Table>
                <TableHeader>
                  <TableRow className={styles.tableHeader}>
                    <TableHead className={styles.tableHeaderCell}>Usuario</TableHead>
                    <TableHead className={styles.tableHeaderCell}>Email</TableHead>
                    <TableHead className={styles.tableHeaderCell}>Estado</TableHead>
                    <TableHead className={styles.tableHeaderCell}>Rol</TableHead>
                    <TableHead className={styles.tableHeaderCell}>Fecha Registro</TableHead>
                    <TableHead className={`${styles.tableHeaderCell} ${styles.userTableActions}`}>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className={styles.loadingContainer}>
                        <div className={styles.loadingContent}>
                          <div className={styles.loadingSpinner}></div>
                          Cargando usuarios...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : statusFilteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className={styles.emptyContainer}>
                        {error ? (
                          <div className={styles.errorMessage}>{error}</div>
                        ) : (
                          <div className={styles.emptyMessage}>
                            {searchTerm
                              ? "No se encontraron usuarios que coincidan con la búsqueda."
                              : "No se encontraron usuarios."}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    statusFilteredUsers.map(user => (
                      <TableRow key={user.id} className={styles.tableRow}>
                        <TableCell className={styles.tableCellPrimary}>
                          <div className={styles.userTableInfo}>
                            <div className={styles.userTableIcon}>
                              <User className={styles.userTableIconSvg} />
                            </div>
                            <div>
                              <div className={styles.userTableName}>{user.name}</div>
                              <div className={styles.userTableSecondary}>
                                {formatOnboardingStatus(user.onboardingStatus ?? null)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={styles.tableCell}>{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className={styles.tableCell}>
                          <Badge className={styles.badgeRole}>{user.role}</Badge>
                        </TableCell>
                        <TableCell className={styles.tableCell}>{formatDate(user.registrationDate)}</TableCell>
                        <TableCell className={styles.userTableActions}>
                          <div className={styles.userTableActionsContainer}>
                            <Link href={`/${locale}/backoffice/users/${user.id}`}>
                              <Button variant='ghost' size='sm' className={styles.userTableButton}>
                                <Eye className='h-4 w-4' />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {(totalUsers ?? 0) > usersPerPage && (
          <Card className={styles.paginationCard}>
            <CardContent className={styles.paginationContent}>
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  Mostrando {startIndex + 1} a {Math.min(endIndex, totalUsers ?? 0)} de {totalUsers} usuarios
                </div>

                <div className={styles.paginationControls}>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    <ChevronLeft className='h-4 w-4' />
                    <span className={styles.paginationButtonText}>Anterior</span>
                  </Button>

                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size='sm'
                          onClick={() => setCurrentPage(page)}
                          className={`${styles.paginationNumber} ${
                            currentPage === page ? styles.paginationNumberActive : styles.paginationNumberInactive
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    <span className={styles.paginationButtonText}>Siguiente</span>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
