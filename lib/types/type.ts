export interface Expense {
    id: string,
    amount?: number,
    category?: string,
    description?: string,
    createdAt: string
}

export interface uptadeeExpense {
    amount: number,
    category: string,
    description: string
}