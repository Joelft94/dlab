"use client"

import { X } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/api"

interface Filter {
  field: string
  value: string
  label: string
}

interface FilterDropdownProps {
  activeFilters: Filter[]
  onAddFilter: (filter: Filter) => void
  onRemoveFilter: (filter: Filter) => void
  data?: User[] // We'll use this to build dynamic filters
}

// Fields we want to enable for filtering
const FILTERABLE_FIELDS: Record<keyof Partial<User>, string> = {
    nationality: "Nacionalidad",
    role: "Rol",
    employeeNumber: "Número de empleado",
    isSuperuser: "Es administrador",
    hasPendingReceipts: "Tiene recibos pendientes",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo",
    address: "Dirección",
    id: "id",
    initials: "Iniciales",
    lastLogin: "Ultima Conexión",
    username: "Usuario",
    fullName: "Nombre completo",
    dateJoined: "Fecha de registro",
    createdAt: "Creado en",
    modifiedAt: "Modificado en",
    phoneNumber: "Número de teléfono",
    requiredPasswordChange: "Password Change Required",
}

export function FilterDropdown({ 
  activeFilters, 
  onAddFilter, 
  onRemoveFilter,
  data = [] 
}: FilterDropdownProps) {
  // Build unique values for each filterable field
  const filterOptions = Object.entries(FILTERABLE_FIELDS).map(([field, label]) => {
    const uniqueValues = new Set(
      data.map(user => String(user[field as keyof User])).filter(Boolean)
    )

    return {
      field,
      label,
      options: Array.from(uniqueValues).map(value => ({
        value,
        label: value.toString(),
      }))
    }
  }).filter(category => category.options.length > 0) // Only show fields that have values

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#4880F8] hover:bg-[#4880F8]/10 font-normal"
          >
            + Agregar filtro
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {filterOptions.map((category) => (
            <DropdownMenu key={category.field}>
              <DropdownMenuTrigger className="w-full px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                {category.label}
                <span className="text-gray-400">▶</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-56">
                {category.options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onAddFilter({
                      field: category.field,
                      value: option.value,
                      label: `${category.label}: ${option.label}`
                    })}
                    disabled={activeFilters.some(
                      f => f.field === category.field && f.value === option.value
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeFilters.map((filter) => (
        <Badge
          key={`${filter.field}-${filter.value}`}
          variant="default"
          className="bg-[#4880F8]/10 text-[#4880F8] flex items-center gap-1 py-1 px-2"
        >
          {filter.label}
          <button
            onClick={() => onRemoveFilter(filter)}
            className="ml-1 hover:bg-[#4880F8]/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}