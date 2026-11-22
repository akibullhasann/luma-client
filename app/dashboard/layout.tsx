import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex min-h-svh flex-1 min-w-0 flex-col bg-[#fdf9f6]">
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[#eaddd8]/80 bg-[#fdf9f6]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <SidebarTrigger className="-ml-1 text-[#6d2e46] hover:bg-[#f6e3e6] hover:text-[#512033]" />
          <div className="h-4 w-px bg-[#eaddd8]" aria-hidden="true" />
          <p className="text-sm font-medium text-[#8a7f7a]">Dashboard</p>
        </div>
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;