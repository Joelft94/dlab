"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, FileText, MessageSquare, Settings, MoreVertical } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: "Empleados", href: "/dashboard/users", icon: Users },
  { name: "Recibos", href: "/dashboard/receipts", icon: FileText },
  { name: "Comunicados", href: "/dashboard/announcements", icon: MessageSquare },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

export function SideNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col bg-black text-white">
      {/* Logo */}
      <div className="px-4 py-5">
        <img src="/dtalent-logo.png" alt="dTalent" className="h-8" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-sm",
                isActive ? "bg-[#4880F8] text-white" : "text-gray-400 hover:bg-gray-900"
              )}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 flex items-center">
        <div className="flex items-center flex-1">
          <div className="h-8 w-8 rounded-full bg-[#4880F8] flex items-center justify-center text-sm">
            DD
          </div>
          <div className="ml-3">
            <p className="text-sm">Bienvenido</p>
            <p className="text-xs text-gray-400">dLab</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}