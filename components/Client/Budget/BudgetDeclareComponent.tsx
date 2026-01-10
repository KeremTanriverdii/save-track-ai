"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState, ChangeEvent } from "react"
import { Budget } from "@/lib/types/type";

export const BudgetDeclareComponent = ({ budget, currency }: Budget) => {
    const [newBudget, setNewBudget] = useState<number>(budget);
    const [message, setMessage] = useState<string | null>()
    const router = useRouter();

    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearMonth = `${date.getFullYear()}-${month}`;

    const getCurrencyCode = () => {
        switch (currency) {
            case '$':
                return 'USD';
            case '€':
                return 'EUR';
            case '₺':
                return 'TRY';
            default:
                return 'No currency found'
        }

    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNewBudget(newBudget);
        try {
            const res = await fetch(`/api/budget?yearMonth=${yearMonth}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newBudget, yearMonth })
            })

            if (!res.ok) throw new Error('Network response was not ok');
            setMessage('Form submitted successfully!');
            router.refresh();
        } catch (err) {
            console.error(err);
            setMessage('Error updating budget');
        }
    }

    if (typeof message === 'string') {
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    }

    // Currency display will be dynamically provided in the input field according to the user's selection.
    return (
        <Card className="pb-0">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-3">
                        <Pencil className="h-5 w-5 text-blue-700" />
                        <h2>Update Budget</h2>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            New Budget Limit
                        </label>


                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">


                            <span className="text-muted-foreground mr-2 font-medium">
                                {currency}
                            </span>


                            <input
                                id="price"
                                type="number"
                                placeholder="0"
                                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={newBudget}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    setNewBudget(parseFloat(event.target.value));
                                }}
                                disabled={currency === 'not choosed user profile'}
                                required
                            />

                            <span className="text-muted-foreground ml-2 text-xs font-medium text-gray-500">
                                {getCurrencyCode()}
                            </span>
                        </div>
                    </div>

                    {message && (
                        <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}

                    {!message && (
                        <p className="text-sm text-muted-foreground">
                            You will be notified when this limit is exceeded.
                        </p>
                    )}

                    <hr className="my-4" />

                    <div className="flex justify-end gap-4 items-center">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Submit
                        </Button>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="bg-muted/50 p-6 rounded-b-lg">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="h-5 w-5 text-blue-700 shrink-0" />
                    <p>
                        Budget changes take effect immediately, not at the beginning of the following month. Past reports remain unaffected.
                    </p>
                </div>
            </CardFooter>
        </Card>
    )
}