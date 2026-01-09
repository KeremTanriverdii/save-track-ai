

import { Card, CardContent } from "@/components/ui/card";
import { TriangleAlert, Wallet2 } from "lucide-react";

interface BudgetStateProps {
  total?: number,
  monthly: {
    monthId: string;
    budget: number;
    currency: string;
    totalMonth: number;
    monthlySpend: number;
    remaining: number;
  } | null
}

export default function BudgetState({ total, monthly }: BudgetStateProps) {


  if (total === 0) return (
    <Card className="relative overflow-hidden w-full min-h-full col-span-2">
      <CardContent className="my-auto mt-auto">
        No have a budget.
      </CardContent>
    </Card>
  )

  const diffValue = monthly?.remaining ?? 0;
  const isNegative = diffValue < 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex gap-5 items-center justify-evenly p-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#212227] p-4 rounded-full">
            <Wallet2 className="text-blue-500" size={32} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly Budget</h2>
            <span className="text-white font-bold text-2xl">
              {monthly ? `${monthly.budget.toFixed(2)}${monthly.currency} ` : '---'}
            </span>
          </div>
        </div>

        <div className="bg-border w-px h-12 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${isNegative ? 'bg-red-500/20 animate-pulse' : 'bg-green-500/20'}`}>
            <TriangleAlert className={isNegative ? 'text-red-500' : 'text-green-500'} size={32} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Remaining</h2>
            <span className={`font-bold text-2xl ${isNegative ? 'text-red-500' : 'text-white'}`}>
              {monthly ? `${diffValue.toFixed(2)}${monthly.currency}` : '---'}
            </span>
          </div>
        </div>

        <div className="bg-border w-px h-12 hidden md:block" />

        <div
          className={`px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-tighter ${isNegative ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
            }`}
        >
          {isNegative ? 'Over Budget' : 'On Budget'}
        </div>
      </CardContent>


    </Card>
  );
}