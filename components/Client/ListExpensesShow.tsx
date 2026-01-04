import { Expense } from "@/lib/types/type";
import { DeleteExpenseButton } from "./DeleteExpenseButton";
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
