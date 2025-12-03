import { Bot, Calendar, ChevronDown, Home, Inbox, Search, Settings } from "lucide-react"

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

export function AppSidebar() {
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
                                            <SidebarMenuSubItem>
                                                <a href="/ai-coach/2025-01">2025-01 Raporu</a>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <a href="/ai-coach/2025-02">2025-02 Raporu</a>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <a href="/ai-coach/2025-03">2025-03 Raporu</a>
                                            </SidebarMenuSubItem>

                                            <SidebarMenuSubItem className="pl-0">
                                                <Collapsible>
                                                    <CollapsibleTrigger asChild>
                                                        <div className="flex items-center justify-between w-full pl-8 py-2 text-sm text-gray-500 hover:text-gray-900 cursor-pointer">
                                                            <span>Diğer Analizler</span>
                                                        </div>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSubItem>
                                                            <a href="/ai-coach/detay/124">Haftalık Analiz 124</a>
                                                        </SidebarMenuSubItem>
                                                        <SidebarMenuSubItem>
                                                            <a href="/ai-coach/detay/125">Risk Değerlendirmesi</a>
                                                        </SidebarMenuSubItem>
                                                    </CollapsibleContent>
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