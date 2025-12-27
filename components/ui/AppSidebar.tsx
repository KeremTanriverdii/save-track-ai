import { Blocks, Bot, ChevronDown, ChevronRight, Home, LogIn, PieChart, User2, Wallet2, } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
import DeleteReportButtonComponent from "../Client/DeleteReportButtonComponent"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu"
import LogoutClientComponent from "../Client/Auth/LogoutClientComponent"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { getUserData } from "@/lib/auth/user"

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
        icon: Blocks,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: PieChart,
    },
    {
        title: "Budged Settings",
        url: "/dashboard/budget",
        icon: Wallet2,
    },

]

export async function AppSidebar() {
    const user = await getUserData();
    const menuItem = await getDateResultsAndDate(user?.uid as string);
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
            {/* Footer section */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <SidebarMenuItem className="w-full">

                                        {/* If user is exist render with user's information in siderbar self*/}
                                        {user ? <div className="flex items-center gap-2 ">
                                            <Avatar>
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback>
                                                    {user.displayName.substring(0, 2).toUpperCase() || 'CN'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div >
                                                {user.displayName.length > 15 ? user.displayName.substring(0, 15) + '...' : user.displayName}
                                            </div>
                                            <ChevronRight className="ms-auto" />
                                        </div> :
                                            <nav className="w-full flex items-center gap-3">

                                                <Link href="/auth/login" className="flex items-center gap-1">
                                                    <LogIn size={20} />
                                                    <span className="font-bold">Sign in</span>
                                                </Link>
                                                or
                                                <Link href="auth/register" className="flex items-center gap-1">
                                                    <User2 size={20} />
                                                    <span className="font-bold">register</span>
                                                </Link>
                                            </nav>
                                        }
                                    </SidebarMenuItem>

                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            {/* Sidebar inside dropdown menu content if user exist*/}
                            {user &&
                                <DropdownMenuContent
                                    side="right"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <Avatar>
                                            <AvatarImage src={user.photoURL} />
                                            <AvatarFallback>
                                                {user.displayName.substring(0, 2).toUpperCase() || 'CN'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="text-[12px] font-medium text-nowrap">
                                            <span>{user.displayName}</span> <br />
                                            <span>{user.email}</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                        <Link href="/dashboard/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <LogoutClientComponent />
                                </DropdownMenuContent>
                            }

                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}