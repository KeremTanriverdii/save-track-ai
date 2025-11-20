"use client"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { useState } from "react";
export default function TestAddExpense() {
    const router = useRouter()
    async function testAddExpenses() {
        const expenseData = {
            amount: 1202,
            category: 'food',
            description: 'Test yemek harcaması2',
        };

        const response = await fetch("/api/expenses", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Gider başarıyla eklendi:", data.expenseId);
            router.refresh()
            alert(`Gider eklendi! ID: ${data.expenseId}`);
        } else {
            const error = await response.json();
            console.error("Gider eklenirken hata oluştu:", error.error);
            alert(`Hata: ${error.error}`);
        }
    }

    return <Button onClick={testAddExpenses}>Add Expense</Button>
}
