'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { Users, Search, Plus, Mail, Shield, UserCheck, UserX, Edit, Trash2, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface UserRow { id: number; name: string; email: string; role: string; is_active: boolean; created_at: string; avatar?: string; }

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  superadmin: { label: 'SuperAdmin', color: 'bg-red-50 text-red-700' },
  admin:      { label: 'Admin',      color: 'bg-amber-50 text-amber-700' },
  instructor: { label: 'Instructor', color: 'bg-blue-50 text-blue-700' },
  student:    { label: 'Estudiante', color: 'bg-slate-100 text-slate-700' },
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['users', search, roleFilter, page],
    queryFn: async () => {
      const { data } = await usersApi.list({ search, ...(roleFilter ? { role: roleFilter } : {}), page, per_page: 15 });
      return data;
    },
  });

  const users: UserRow[] = data?.data ?? [];
  const meta = data?.meta;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500 mt-0.5">{meta?.total ?? users.length} usuarios registrados</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Buscar por nombre o email..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
          />
        </div>
        <select
          value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 min-w-[140px]"
        >
          <option value="">Todos los roles</option>
          <option value="superadmin">SuperAdmin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Estudiante</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden xl:table-cell">Registrado</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.map(u => {
                const rc = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.student;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-slate-800">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${rc.color}`}>{rc.label}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-500">{u.is_active ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <p className="text-xs text-slate-500">{formatDate(u.created_at)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                            <MoreVertical size={15} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="min-w-[150px] bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50" align="end">
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none">
                              <Edit size={13} /> Editar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none">
                              <Mail size={13} /> Enviar email
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer outline-none">
                              {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                              {u.is_active ? 'Desactivar' : 'Activar'}
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none">
                              <Trash2 size={13} /> Eliminar
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No se encontraron usuarios</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Página {meta.current_page} de {meta.last_page}</p>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors">Anterior</button>
              <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
