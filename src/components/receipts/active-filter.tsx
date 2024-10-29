"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Define the filter options mapping
const FILTER_VALUES: Record<string, { label: string; value: any }[]> = {
  paymentType: [
    { label: 'LiqMensual', value: 'LiqMensual' },
  ],
  sector: [
    { label: 'Sector 1', value: 'sector1' },
    { label: 'Sector 2', value: 'sector2' },
  ],
  year: [
    { label: '2024', value: 2024 },
    { label: '2023', value: 2023 },
  ],
  month: [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 },
  ],
  sent: [
    { label: 'Todos', value: null },
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ],
  read: [
    { label: 'Todos', value: null },
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ],
}

// Mapping for filter labels
const FILTER_LABELS: Record<string, string> = {
  paymentType: 'Tipo de remuneración',
  sector: 'Sector',
  year: 'Año',
  month: 'Mes',
  sent: 'Enviado',
  read: 'Leído',
}

interface FilterProps {
  id: string;
  value: any;
  onValueChange: (value: any) => void;
  onRemove: () => void;
}

export function ActiveFilter({ id, value, onValueChange, onRemove }: FilterProps) {
  const options = FILTER_VALUES[id] || []
  const currentLabel = value === null ? 'Todos' : 
    options.find(opt => opt.value === value)?.label || 'Seleccionar'
  
  return (
    <div className="flex items-center gap-2 text-[#4880F8]">
      <span>{FILTER_LABELS[id] || id}:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#4880F8] hover:bg-transparent hover:text-[#4880F8]/90 p-0"
          >
            {currentLabel}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-[#1E1E1E] border-gray-800 min-w-[120px]"
          align="start"
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value?.toString() ?? 'null'}
              onClick={() => onValueChange(option.value)}
              className="text-gray-400 hover:text-white"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={onRemove}
            className="text-gray-400 hover:text-white border-t border-gray-800 mt-1"
          >
            Remover filtro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}