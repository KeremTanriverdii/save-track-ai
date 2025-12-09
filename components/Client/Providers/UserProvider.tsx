"use client"

import { User, UserProviderProps } from "@/lib/types/type"
import { createContext, useContext } from "react"

const UserContext = createContext<User | undefined>(undefined)

export function UserProviderCC({ children, initialData }: UserProviderProps) {
    return (
        <UserContext.Provider value={initialData!}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): User => {
    const context = useContext(UserContext as unknown as React.Context<User>);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}