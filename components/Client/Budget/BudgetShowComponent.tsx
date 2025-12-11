import { Budget } from "@/lib/types/type";

export default function BudgetShowComponent({ budget }: { budget: number }) {
    return (
        <div>
            And now budget: {budget}
        </div>
    )
}
