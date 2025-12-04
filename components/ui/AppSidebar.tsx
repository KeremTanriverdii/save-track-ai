import { Bot, Calendar, ChevronDown, Delete, Home, Inbox, LucideIcon, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import getDateResultsAndDate from "@/lib/ai-respons/getDateResultsAndDate"
import Link from "next/link"
import { Button } from "./button"
import DeleteReportButtonComponent from "../Client/DeleteReportButtonComponent"

// Menu items.
const items = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Expenses",
        url: "/dashboard/expenses",
        icon: Inbox,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Calendar,
    },
    {
        title: "Budged Settings",
        url: "/dashboard/budged",
        icon: Search,
    },

]

export async function AppSidebar() {
    const menuItem = await getDateResultsAndDate();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* 1. Normal Menü Öğeleri */}
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            <SidebarMenuItem className="p-0">
                                <Collapsible defaultOpen className="group/collapsible">
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="w-full justify-between pr-3">
                                            <div className="flex items-center gap-3">
                                                <Bot className="h-5 w-5" />
                                                <span>Ai Coach</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {menuItem.map((item) => (
                                                <SidebarMenuSubItem key={item.id} className="flex justify-between items-center">
                                                    <Link href={`/dashboard/ai-coach/details/${item.id}`}>
                                                        {item.createdAt
                                                            ? `${new Date(item.createdAt).toLocaleDateString()} Report`
                                                            : "Tarih Yok"}
                                                    </Link>
                                                    <DeleteReportButtonComponent id={item.id} />
                                                </SidebarMenuSubItem>
                                            ))}
                                            <SidebarMenuSubItem className="pl-0">
                                                <Collapsible>
                                                    <CollapsibleTrigger asChild>
                                                        <div className="flex items-center justify-between w-full pl-8 py-2 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
                                                            <span>Diğer Analizler</span>
                                                        </div>
                                                    </CollapsibleTrigger>

                                                </Collapsible>
                                            </SidebarMenuSubItem>

                                        </SidebarMenuSub>
                                    </CollapsibleContent>

                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}