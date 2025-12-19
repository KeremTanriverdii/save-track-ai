"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";

export const UpdateExpenseButton = ({ id, amount, category, description, title }: { id: string, amount: number, category: string, description: string, title: string }) => {
    const [editState, setEditState] = useState<boolean>(false)
    const router = useRouter()
    const [expensesData, setExpensesData] = useState({
        amount: amount,
        category: category,
        description: description,
        title: title,
    })

    const handleUpdate = async (id: string) => {
        const expenseData = {
            amount: expensesData.amount,
            category: expensesData.category, // Assuming category is already a string
            description: expensesData.description,
            title: expensesData.title,
        };
        const fetchRequest = await fetch(`/api/expenses`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, expenseData }),
        });
        if (fetchRequest.ok) {
            console.log("Put Request sended succesfully")
            router.refresh()
        }
    }


    return (
        <div className="flex justify-between border p-2">
            {!editState ? (
                <div>
                    <Button onClick={() => setEditState(true)}>Update</Button>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    <Button onClick={() => setEditState(false)}>Cancel</Button>
                    <input
                        type="number"
                        name="amount"
                        value={expensesData.amount}
                        onChange={(e) => setExpensesData({
                            ...expensesData,
                            amount: Number(e.target.value)

                        })}
                    />
                    <input type="text" name="category" value={expensesData.category}
                        onChange={(e) => setExpensesData({
                            ...expensesData,
                            category: e.target.value
                        })}
                    />
                    <input type="text" name="description" id="" value={expensesData.description}
                        onChange={(e) => setExpensesData({
                            ...expensesData,
                            description: e.target.value
                        })}
                    />
                    <input type="text" name="title" id="" value={expensesData.title}
                        onChange={(e) => setExpensesData({
                            ...expensesData,
                            title: e.target.value
                        })}
                    />
                    <Button onClick={() => { handleUpdate(id); setEditState(false) }}>Update</Button>
                </div>
            )}
        </div>
    )

}