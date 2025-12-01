"use client";

import { useEffect, useState } from "react";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { Budget } from "@/lib/types/type";
import { Card, CardContent } from "@/components/ui/card";

export default function BudgetState({ total }: { total: number }) {
  const [remaining, setRemaining] = useState<Budget | null>(null);

  const totalSpending = total;

  useEffect(() => {
    async function getRemaining() {
      const remainingBudget = await calcRemaining(totalSpending);
      setRemaining(remainingBudget as Budget);
    }
    getRemaining();
  }, [totalSpending]);

  return (
    <Card>
      <CardContent className="p-2">
        <h2 className="text-sm font-semibold">Budged: {remaining?.budget ?? 'Loading...'}</h2>
        {remaining !== null ? (
          <p className={`text-lg font-bold ${remaining.diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
            Remaining: {remaining.diff.toFixed(2)}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}