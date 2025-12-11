"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React, { useState, ChangeEvent } from "react"

export const BudgetDeclareComponent = () => {
    const [budget, setBudget] = useState<number>(0);
    const [message, setMessage] = useState<string>('')
    const router = useRouter();
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonth = `${date.getFullYear()}-${month}`;


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior
        // The budged state is already updated by the onChange handler of the input
        try {
            const res = await fetch(`/api/budget?yearMonth=${yearMonth}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ budget, yearMonth })
            })
        } catch (err) {
            console.log(err);
            throw new Error('Error budged fetch');
        }
        setMessage('Form submitted successfully!');
        router.refresh();
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-min gap-5">
            <input type="number"
                name="budgetAmount"
                className="border-white border-2 rounded-2xl"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))} />
            <Button type="submit">Submit</Button>
            {message && <p>{message}</p>}
        </form>
    )
}