import { Expense } from "@/lib/types/type";
import { DeleteExpenseButton } from "./DeleteExpenseButton";
import { UpdateExpenseButton } from "./UpdateExpenseButton";

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
                    <UpdateExpenseButton
                        id={item.id}
                        category={item.category as string}
                        amount={item.amount as number}
                        description={item.description as string}
                    />
                </div>
            ))}
        </div>
    )
}
