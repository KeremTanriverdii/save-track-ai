import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function BudgetShowComponent({ budget }: { budget: number | null }) {
    if (!budget) return 0
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Your monthly now budget:
                </CardTitle>
                <div className="flex justify-between">
                    <p className="text-4xl font-bold">{budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} TL</p>
                    <div className="bg-blue-300 rounded-full flex items-center justify-center w-10 h-10">
                        <Landmark color="#193CB8" />
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}
