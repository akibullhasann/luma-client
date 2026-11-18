'use client'

import Link from "next/link"
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
    const role: DashboardRole = session?.user?.role === "admin" ? "admin" : "patrons"
    return (
        <Sidebar style={{ "--sidebar": "#fdf9f6" } as React.CSSProperties}>
            <SidebarHeader className="border-b border-blush px-4 py-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum"
                    aria-label="Luma home"
                >
                    <span className="flex size-8 items-center justify-center rounded-full bg-plum text-cream shadow-sm">
                        <Sparkles className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-heading text-xl font-semibold tracking-tight text-plum">
                        Luma
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItemsByRole[role].map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton render={<Link href={item.url} />}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}