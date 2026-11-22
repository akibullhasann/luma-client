'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import {
    CalendarDays,
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    Plus,
    Scissors,
    Sparkles,
    UserRound,
    UsersRound,
} from "lucide-react"

import type { DashboardMenuItem, DashboardRole } from "@/typescript"

const menuItemsByRole: Record<DashboardRole, DashboardMenuItem[]> = {
    patrons: [
        {
            id: "patrons-overview",
            name: "Overview",
            url: "/dashboard/patrons",
            icon: LayoutDashboard,
        },
        {
            id: "patrons-appointments",
            name: "My Appointments",
            url: "/dashboard/patrons/appointments",
            icon: CalendarDays,
        },
        {
            id: "patrons-browse-services",
            name: "Browse Services",
            url: "/services",
            icon: Scissors,
        },
        {
            id: "patrons-profile",
            name: "My Profile",
            url: "/dashboard/patrons/profile",
            icon: UserRound,
        },
    ],
    admin: [
        {
            id: "admin-overview",
            name: "Overview",
            url: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            id: "admin-services",
            name: "Manage Services",
            url: "/dashboard/admin/services",
            icon: Scissors,
        },
        {
            id: "admin-service-form",
            name: "Add/Update Service",
            url: "/dashboard/admin/services/new",
            icon: Plus,
        },
        {
            id: "admin-appointments",
            name: "Manage Appointments",
            url: "/dashboard/admin/appointments",
            icon: ClipboardList,
        },
        {
            id: "admin-users",
            name: "Manage Users",
            url: "/dashboard/admin/users",
            icon: UsersRound,
        },
        {
            id: "admin-transactions",
            name: "Transactions",
            url: "/dashboard/admin/transactions",
            icon: CreditCard,
        },
        {
            id: "admin-profile",
            name: "My Profile",
            url: "/dashboard/admin/profile",
            icon: UserRound,
        },
    ],
}

export function DashboardSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const role: DashboardRole = session?.user?.role === "admin" ? "admin" : "patrons"
    return (
        <Sidebar style={{ "--sidebar": "#fdf9f6" } as React.CSSProperties} className="border-r border-[#eaddd8]">
            <SidebarHeader className="border-b border-[#eaddd8] px-4 py-5">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum"
                    aria-label="Luma home"
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#6d2e46] text-[#fdf9f6] shadow-sm">
                        <Sparkles className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                        <span className="block font-heading text-xl font-semibold tracking-tight text-[#6d2e46]">
                            Luma
                        </span>
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-[#8a7f7a]">
                            Dashboard
                        </span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4">
                <SidebarGroup className="p-0">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7f7a]">
                        {role === "admin" ? "Admin Menu" : "My Menu"}
                    </p>
                    <SidebarMenu className="gap-1">
                        {menuItemsByRole[role].map((item) => {
                            const isActive = pathname === item.url || (item.url !== "/dashboard/admin" && item.url !== "/dashboard/patrons" && pathname.startsWith(item.url + "/"));
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        render={<Link href={item.url} />}
                                        isActive={isActive}
                                        className="rounded-xl px-3 py-2.5 text-[#5d5550] transition hover:bg-[#f6e3e6] hover:text-[#6d2e46] data-[active=true]:bg-[#6d2e46] data-[active=true]:text-white data-[active=true]:shadow-sm"
                                    >
                                        <item.icon className="size-4" />
                                        <span className="font-medium">{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-[#eaddd8] px-4 py-4">
                <p className="text-xs text-[#8a7f7a]">Signed in as <span className="font-medium text-[#6d2e46] capitalize">{role}</span></p>
            </SidebarFooter>
        </Sidebar>
    )
}