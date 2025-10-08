"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Filter,
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Calendar,
  Mail,
  User,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import styles from "./backoffice.module.css";

// service helpers
import {
  getAllUsers,
  getWishListUsers,
  getInProgressUsers,
  getProposalPendingUsers,
  getProposalApprovedUsers,
  getProposalRejectedUsers,
} from "@/services/userFetch";

// fallback mapping for fields coming from the API to the shape used by the UI
function normalizeUser(u: any, appliedFilter?: string) {
  return {
    id: u.id ?? u._id ?? u.userId,
    // name may be split into name/lastname or firstName/lastName
    name:
      (u.name ??
        (u.firstName ? `${u.firstName} ${u.lastName ?? ""}`.trim() : null) ??
        (u.name || u.lastname ? `${u.name ?? ""} ${u.lastname ?? ""}`.trim() : null)) ||
      "Sin nombre",
    email: u.email ?? u.emailAddress ?? "-",
    // proposal fields may live under `client` in the new API
    role: u.role ?? u.roleName ?? "usuario",
    registrationDate: u.registrationDate ?? u.created_at ?? u.createdAt ?? null,
    lastLogin: u.lastLogin ?? u.last_login ?? null,
    // derive status from many possible shapes, preferring explicit status
    status: (() => {
      // Si tenemos un filtro aplicado y no es "todos", confiamos en él
      if (appliedFilter && appliedFilter !== "todos") {
        return appliedFilter;
      }

      // Si hay un status explícito, lo usamos
      if (u.status) return u.status;

      const proposalUrl = u.proposal_url ?? u.client?.proposal_url ?? u.client?.proposalUrl;
      const proposalStatus = u.proposal_status ?? u.client?.proposal_status ?? u.client?.proposalStatus;
      const wishList = u.wish_list ?? u.client?.wish_list ?? false;

      // if there is a proposal URL, map proposal_status to readable state
      if (proposalUrl !== null && proposalUrl !== undefined && String(proposalUrl) !== "null") {
        if (proposalStatus === "approved") return "con-propuesta-aprobada";
        if (proposalStatus === "pending") return "con-propuesta-revision";
        if (proposalStatus === "rejected") return "rechazado";
        return "con-propuesta";
      }

      if (wishList) return "lista-espera";
      // no proposal URL -> treat as in-progress / sin-propuesta
      return "sin-propuesta";
    })(),
    raw: u,
  };
}

export default function UserManagement() {
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
      case "sin-propuesta":
        return getInProgressUsers;
      case "con-propuesta-revision":
        return getProposalPendingUsers;
      case "con-propuesta-aprobada":
        return getProposalApprovedUsers;
      case "rechazado":
        return getProposalRejectedUsers;
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

        const normalized = (items || []).map(user => normalizeUser(user, statusFilter));
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
      case "con-propuesta-revision":
        return (
          <Badge className='bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium'>
            Con Propuesta - En Revisión
          </Badge>
        );
      case "con-propuesta-aprobada":
        return (
          <Badge className='bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium'>
            Con Propuesta - Aprobada
          </Badge>
        );
      case "lista-espera":
        return (
          <Badge className='bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium'>
            En Lista de Espera
          </Badge>
        );
      case "sin-propuesta":
        return (
          <Badge className='bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'>
            Sin Propuesta
          </Badge>
        );
      case "rechazado":
        return <Badge className='bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-medium'>Rechazado</Badge>;
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
    <div className={`${styles.root} min-h-screen bg-slate-50/50`}>
      <div className='mx-0 p-4 sm:p-6 lg:p-1 space-y-6'>
        {/* Header */}
        <div className='bg-white rounded-lg border border-slate-200 p-6 shadow-sm'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Gestión de Usuarios</h1>
              <p className='text-slate-600 mt-1'>Administra y supervisa todos los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-slate-900'>
              <Filter className='h-5 w-5 text-slate-600' />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col lg:flex-row gap-4'>
              {/* Search Input */}
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                <Input
                  placeholder='Buscar por nombre o email...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className='w-full lg:w-[280px] border-slate-300 focus:border-blue-500 focus:ring-blue-500'>
                  <SelectValue placeholder='Filtrar por estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los estados</SelectItem>
                  <SelectItem value='con-propuesta-revision'>Con Propuesta - En Revisión</SelectItem>
                  <SelectItem value='con-propuesta-aprobada'>Con Propuesta - Aprobada</SelectItem>
                  <SelectItem value='lista-espera'>En Lista de Espera</SelectItem>
                  <SelectItem value='sin-propuesta'>Sin Propuesta</SelectItem>
                  <SelectItem value='rechazado'>Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <CardTitle className='text-slate-900'>
                Lista de Usuarios ({totalUsers ?? filteredUsers.length}{" "}
                {(totalUsers ?? filteredUsers.length) === 1 ? "usuario" : "usuarios"})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {/* Mobile Cards View */}
            <div className='block lg:hidden'>
              {loading ? (
                <div className='p-8 text-center'>
                  <div className='inline-flex items-center gap-2 text-slate-600'>
                    <div className='w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin'></div>
                    Cargando usuarios...
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className='p-8 text-center'>
                  {error ? (
                    <div className='text-red-600 font-medium'>{error}</div>
                  ) : (
                    <div className='text-slate-500'>
                      {searchTerm
                        ? "No se encontraron usuarios que coincidan con la búsqueda."
                        : "No se encontraron usuarios."}
                    </div>
                  )}
                </div>
              ) : (
                <div className='divide-y divide-slate-200'>
                  {filteredUsers.map(user => (
                    <div key={user.id} className='p-4 hover:bg-slate-50 transition-colors'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-2'>
                            <div className='p-1.5 bg-slate-100 rounded-full'>
                              <User className='h-3 w-3 text-slate-600' />
                            </div>
                            <h3 className='font-semibold text-slate-900 truncate'>{user.name}</h3>
                          </div>

                          <div className='space-y-2 text-sm'>
                            <div className='flex items-center gap-2 text-slate-600'>
                              <Mail className='h-3 w-3' />
                              <span className='truncate'>{user.email}</span>
                            </div>

                            <div className='flex items-center gap-2 text-slate-600'>
                              <Calendar className='h-3 w-3' />
                              <span>{formatDate(user.registrationDate)}</span>
                            </div>

                            <div className='flex items-center gap-2'>{getStatusBadge(user.status)}</div>
                          </div>
                        </div>

                        <div className='ml-4 flex-shrink-0'>
                          <Link href={`/usuarios/${user.id}`}>
                            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
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
            <div className='hidden lg:block overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-slate-200'>
                    <TableHead className='font-semibold text-slate-700'>Usuario</TableHead>
                    <TableHead className='font-semibold text-slate-700'>Email</TableHead>
                    <TableHead className='font-semibold text-slate-700'>Estado</TableHead>
                    <TableHead className='font-semibold text-slate-700'>Rol</TableHead>
                    <TableHead className='font-semibold text-slate-700'>Fecha Registro</TableHead>
                    <TableHead className='text-right font-semibold text-slate-700'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center py-12'>
                        <div className='inline-flex items-center gap-2 text-slate-600'>
                          <div className='w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin'></div>
                          Cargando usuarios...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center py-12'>
                        {error ? (
                          <div className='text-red-600 font-medium'>{error}</div>
                        ) : (
                          <div className='text-slate-500'>
                            {searchTerm
                              ? "No se encontraron usuarios que coincidan con la búsqueda."
                              : "No se encontraron usuarios."}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id} className='border-slate-200 hover:bg-slate-50/50 transition-colors'>
                        <TableCell className='font-medium text-slate-900'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-slate-100 rounded-full'>
                              <User className='h-4 w-4 text-slate-600' />
                            </div>
                            <div>
                              <div className='font-semibold'>{user.name}</div>
                              <div className='text-xs text-slate-500'>{user.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-slate-600'>{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className='text-slate-600 capitalize'>{user.role}</TableCell>
                        <TableCell className='text-slate-600'>{formatDate(user.registrationDate)}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-center mr-7'>
                            <Link href={`/usuarios/${user.id}`}>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                              >
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
          <Card className='border-slate-200 shadow-sm'>
            <CardContent className='p-4'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='text-sm text-slate-600 text-center sm:text-left'>
                  Mostrando {startIndex + 1} a {Math.min(endIndex, totalUsers ?? 0)} de {totalUsers} usuarios
                </div>

                <div className='flex items-center justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='border-slate-300 hover:bg-slate-50 disabled:opacity-50'
                  >
                    <ChevronLeft className='h-4 w-4' />
                    <span className='hidden sm:inline ml-1'>Anterior</span>
                  </Button>

                  <div className='flex items-center gap-1'>
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
                          className={`w-8 h-8 p-0 ${
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border-slate-300 hover:bg-slate-50"
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
                    className='border-slate-300 hover:bg-slate-50 disabled:opacity-50'
                  >
                    <span className='hidden sm:inline mr-1'>Siguiente</span>
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
