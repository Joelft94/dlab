"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, ChevronDown, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterDropdown } from "@/components/users/filter-dropdown"

interface Filter {
  field: string
  value: string
  label: string
}

export default function UsersPage() {
  const [filters, setFilters] = useState<{
    search: string
    sortBy: string
    activeFilters: Filter[]
  }>({
    search: "",
    sortBy: "Número",
    activeFilters: [],
  })

  // Get users with filters
  const { data, isLoading } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers({
      search: filters.search,
      ...filters.activeFilters.reduce((acc, filter) => ({
        ...acc,
        [filter.field]: filter.value
      }), {})
    })
  })

  // Get all users without filters for filter options
  const { data: allUsers } = useQuery({
    queryKey: ["users-all"],
    queryFn: () => getUsers(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  const handleAddFilter = useCallback((filter: Filter) => {
    setFilters(prev => ({
      ...prev,
      activeFilters: [...prev.activeFilters.filter(f => f.field !== filter.field), filter]
    }))
  }, [])

  const handleRemoveFilter = useCallback((filterToRemove: Filter) => {
    setFilters(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.filter(
        f => f.field !== filterToRemove.field || f.value !== filterToRemove.value
      )
    }))
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">Lista de empleados</h1>
          <Badge variant="primary" className="px-2.5 py-0.5 text-xs font-medium bg-[#4880F8] text-white rounded-full h-6 min-w-[1.5rem] flex items-center justify-center">
            {data?.totalCount || 0}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-grad-800 hover:bg-gray-50"
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
     <div className="rounded-lg overflow-hidden bg-[#1E1E1E] border border-gray-800">

      <div className=" rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Ordenar por</span>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-400">
                  {filters.sortBy}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <FilterDropdown
                activeFilters={filters.activeFilters}
                onAddFilter={handleAddFilter}
                onRemoveFilter={handleRemoveFilter}
                data={allUsers?.results}
              />
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
            <tbody className="divide-y divide-gray-200">
              {data?.results.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#4880F8] flex items-center justify-center text-white">
                        {user.initials}
                      </div>
                      <span className="text-sm font-medium text-white">
                        #{user.employeeNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
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
  </div>
  )
}