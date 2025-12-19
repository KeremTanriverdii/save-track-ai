import { Expense, Expenses } from "@/lib/types/type";
import { DeleteExpenseButton } from "./DeleteExpenseButton";
import { UpdateExpenseButton } from "./UpdateExpenseButton";
import { ColumnDef } from '@tanstack/react-table'
export default function ListExpensesShow({ initialData }: { initialData: Expense[] }) {
    const expenseData = initialData


    return (
        <div>
            {expenseData.map((item) => (
                <div key={item.id}>
                    <li>Amount {item.amount}</li>
                    <li>Category: {item.category}</li>
                    <li>description: {item.description}</li>
                    <li>{item.id}</li>
                    <DeleteExpenseButton
                        id={item.id}
                    />

                </div>
            ))}
        </div>
    )
}
