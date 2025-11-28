import { Budged } from "@/lib/types/type";

export default function BudgetShowComponent({ budgets }: { budgets: Budged[] }) {
    const { budget } = budgets[0]
    return (
        <div>
            And now budget: {budget}
        </div>
    )
}
