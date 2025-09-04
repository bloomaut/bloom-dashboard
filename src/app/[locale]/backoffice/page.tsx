"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./backoffice.module.css"; // add this import

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
function normalizeUser(u: any) {
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

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
        // "sin-propuesta" treated as users currently doing the questionnaire (proposal_url=null & wish_list=false)
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
        // normalize response: support multiple API shapes, including the new
        // one: { data: { result: { users: { total, page, limit, items: [...] }}}}
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

        const normalized = (items || []).map(normalizeUser);
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
        return <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'>Con Propuesta - En Revisión</Badge>;
      case "con-propuesta-aprobada":
        return <Badge className='bg-green-100 text-green-800 hover:bg-green-200'>Con Propuesta - Aprobada</Badge>;
      case "lista-espera":
        return <Badge className='bg-secondary/10 text-secondary hover:bg-secondary/20'>En Lista de Espera</Badge>;
      case "sin-propuesta":
        return <Badge variant='secondary'>Sin Propuesta</Badge>;
      case "rechazado":
        return <Badge className='bg-red-100 text-red-800 hover:bg-red-200'>Rechazado</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  return (
    // wrap page in the scoped root class to override global font vars
    <div className={`${styles.root} space-y-6 m-2`}>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className='w-full sm:w-[300px] flex items-center'>
                <SelectValue placeholder='Estado' />
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
      <Card>
        <CardHeader>
          <CardTitle onClick={() => console.log(users, totalUsers)}>
            Lista de Usuarios ({totalUsers ?? users.length} {totalUsers === 1 ? "usuario" : "usuarios"})
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[150px]'>Usuario</TableHead>
                  <TableHead className='min-w-[200px] hidden sm:table-cell'>Email</TableHead>
                  <TableHead className='min-w-[100px]'>Estado</TableHead>
                  <TableHead className='min-w-[100px] hidden md:table-cell'>Rol</TableHead>
                  <TableHead className='min-w-[120px] hidden lg:table-cell'>Fecha Registro</TableHead>
                  <TableHead className='text-right min-w-[120px]'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6 as any} className='text-center py-8'>
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6 as any} className='text-center py-8'>
                      {error ? (
                        <span className='text-red-600'>{error}</span>
                      ) : (
                        <span className='text-muted-foreground'>No se encontraron usuarios.</span>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>
                        <div>
                          <div>{user.name}</div>
                          <div className='text-xs text-muted-foreground sm:hidden'>{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground hidden sm:table-cell'>{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className='hidden md:table-cell'>{user.role}</TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString("es-ES") : "-"}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-1'>
                          <Link href={`/usuarios/${user.id}`}>
                            <Button variant='ghost' size='sm' className='hidden sm:inline-flex'>
                              <Edit className='h-4 w-4' />
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

          {/* empty states handled above */}
        </CardContent>
      </Card>

      {(totalUsers ?? 0) > usersPerPage && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Mostrando {startIndex + 1} a {Math.min(endIndex, totalUsers ?? 0)} de {totalUsers} usuarios
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='cursor-pointer'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Anterior
                </Button>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                      className='w-8 h-8 p-0 cursor-pointer'
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  className='cursor-pointer'
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
