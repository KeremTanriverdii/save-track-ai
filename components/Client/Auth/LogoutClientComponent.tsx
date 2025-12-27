"use client"

import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";


export default function LogoutClientComponent() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/sessionLogout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            router.refresh()
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    return (
        <DropdownMenuItem onSelect={handleLogout} className="w-full cursor-pointer" >
            Logout
        </DropdownMenuItem>
    )
}
