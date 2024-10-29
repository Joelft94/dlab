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
import { Plus, Filter } from "lucide-react"
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
  data?: User[]
}

const FILTERABLE_FIELDS: Partial<Record<keyof User, string>> = {
    nationality: "Nacionalidad", //
    role: "Rol", // 
    isSuperuser: "Es administrador",
    address: "Dirección",
}

export function FilterDropdown({ 
  activeFilters, 
  onAddFilter, 
  onRemoveFilter,
  data = [] 
}: FilterDropdownProps) {
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
  }).filter(category => category.options.length > 0)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#4880F8] hover:bg-transparent hover:text-[#4880F8]/90 p-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Agregar filtro
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-56 bg-[#1E1E1E] border border-gray-800"
        >
          {filterOptions.map((category) => (
            <DropdownMenu key={category.field}>
              <DropdownMenuTrigger className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-transparent cursor-pointer flex items-center justify-between">
                {category.label}
                <span className="text-gray-400">▶</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="right" 
                className="w-56 bg-[#1E1E1E] border border-gray-800"
              >
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
                    className="flex items-center justify-between text-gray-400 hover:text-white hover:bg-transparent px-3 py-2 disabled:opacity-50"
                  >
                    <span>{option.label}</span>
                    <Plus className="h-4 w-4" />
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