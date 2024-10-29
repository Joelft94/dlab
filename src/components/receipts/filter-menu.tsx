"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, Plus } from "lucide-react"

const FILTER_OPTIONS = [
  {
    id: 'paymentType',
    label: 'Tipo de remuneración'
  },
  {
    id: 'sector',
    label: 'Sector'
  },
  {
    id: 'year',
    label: 'Año'
  },
  {
    id: 'month',
    label: 'Mes'
  },
  {
    id: 'sent',
    label: 'Enviado'
  },
  {
    id: 'read',
    label: 'Leído'
  }
]

interface FilterMenuProps {
  onAddFilter: (id: string) => void;
}

export function FilterMenu({ onAddFilter }: FilterMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-[#4880F8] hover:bg-transparent hover:text-[#4880F8]/90 p-0 flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Agregar filtro</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start"
        className="w-56 bg-[#1E1E1E] border-gray-800"
      >
        {FILTER_OPTIONS.map((filter) => (
          <DropdownMenuItem
            key={filter.id}
            onClick={() => onAddFilter(filter.id)}
            className="flex items-center justify-between text-gray-400 hover:text-white hover:bg-transparent"
          >
            <span>{filter.label}</span>
            <Plus className="h-4 w-4" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}