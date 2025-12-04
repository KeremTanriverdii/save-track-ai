"use client";

import { useEffect, useState } from "react";
import { calcRemaining } from "@/lib/budged/calcRemaining";
import { Budget } from "@/lib/types/type";
import { Card, CardContent } from "@/components/ui/card";

export default function BudgetState({ total }: { total: number }) {
  const [remaining, setRemaining] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const totalSpending = total;

  useEffect(() => {
    setIsLoading(true);
    async function getRemaining() {
      const remainingBudget = await calcRemaining(totalSpending);
      setRemaining(remainingBudget as Budget);
    }
    getRemaining();
    setIsLoading(false);
  }, [totalSpending]);
  console.log(remaining)
  return (
    <Card className="">
      <CardContent>
        <h2 className="text-lg font-medium text-muted-foreground">Budged: {remaining?.budget ?? 'No data avaible'}</h2>
      </CardContent>
      {isLoading && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {!isLoading && remaining?.diff === null ? (
        <CardContent className="p-2">
          <p className="text-sm text-gray-500">Loading...</p>
          <div>{remaining.error}</div>
        </CardContent>
      ) : (
        <CardContent className="p-2">
          <p className={`text-lg font-bold px-4 ${remaining?.diff && remaining.diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
            Remaining: {remaining?.diff?.toFixed(2)}
          </p>
        </CardContent>

      )}
    </Card>
  );
}