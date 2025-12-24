"use client";

import { useEffect, useState } from "react";
import { Budget } from "@/lib/types/type";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TriangleAlert, Wallet2 } from "lucide-react";

export default function BudgetState({ total }: { total: number }) {
  const [remaining, setRemaining] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!total) return;

    const getRemaining = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/budget?totalSpending=${total}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Error budget fetch');

        const data = await res.json();
        setRemaining(data.remaining as Budget);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getRemaining();
  }, [total]);

  if (!total) return null;

  const diffValue = remaining?.diff ?? 0;
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
              {remaining ? `${remaining.budget.toFixed(2)}₺` : '---'}
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
              {remaining ? `${diffValue.toFixed(2)}₺` : '---'}
            </span>
          </div>
        </div>

        <div className="bg-border w-px h-12 hidden md:block" />

        <div className={`px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-tighter ${isNegative ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
          {isNegative ? 'Over Budget' : 'On Budget'}
        </div>
      </CardContent>

      {isLoading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      )}
    </Card>
  );
}