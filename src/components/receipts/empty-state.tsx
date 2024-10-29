import { HeartCrack } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <HeartCrack className="h-16 w-16 text-red-500 mb-4" />
      <p className="text-gray-400 text-center">
        Lo lamentamos, no se han encontrado registros disponibles en esta página.
      </p>
    </div>
  )
}
