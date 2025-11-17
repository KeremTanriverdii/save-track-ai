"use client"
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react"
import { app } from "../lib/firebase";

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [auth]);
    return user;
}