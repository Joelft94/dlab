import { SideNav } from "@/components/shared/side-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}