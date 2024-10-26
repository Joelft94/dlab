"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, ChevronDown, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function UsersPage() {
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "Número",
  })

  const { data, isLoading } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Lista de empleados</h1>
          <Badge variant="primary" className="rounded-full bg-[#4880F8] bg-opacity-10 text-[#4880F8]">
            {data?.totalCount || 0}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50"
          >
            IMPORTAR
          </Button>
          <Button 
            className="bg-[#4880F8] hover:bg-[#4880F8]/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            NUEVO EMPLEADO
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por</span>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  {filters.sortBy}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#4880F8] hover:bg-[#4880F8]/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Agregar filtro
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar empleados"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9 w-[300px]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#4880F8]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white">
                  Número
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white">
                  Correo electrónico
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white">
                  Teléfono / Celular
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.results.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#4880F8] flex items-center justify-center text-white">
                        {user.initials}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        #{user.employeeNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data && data.numPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!data.previous}
              >
                {"<"}
              </button>
              <span className="text-sm text-gray-600">
                Página 1 de {data.numPages}
              </span>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                disabled={!data.next}
              >
                {">"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}