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
            router.push('/dashboard')
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    return (
        <DropdownMenuItem>
            <button onClick={handleLogout}>Logout</button>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
    )
}
