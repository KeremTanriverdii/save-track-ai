import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { CATEGORY_MAP } from '@/lib/types/constants';

const getCategoryIcon = (categoryName: string) => {
    const cat = CATEGORY_MAP[categoryName];

    if (cat && cat.icon) {
        return <cat.icon className="w-6 h-6" color={cat.color} />;
    }

    return <AlertCircle className="w-4 h-4 text-gray-400" />;
};

interface CriticalCardProps {
    date?: string;
    category: string;
    amount: number;
    percentage: number;
    title?: string
}
export function CriticalCard({ date, category, amount, percentage, title }: CriticalCardProps) {

    return (
        <Card className="bg-[#121212] border-zinc-800 text-white min-w-[250px] flex-1">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {date}
                    </span>
                    <div className="p-2 bg-zinc-900 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(category)}
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold">₺{amount.toLocaleString('tr-TR')}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                        {category} • <span className="text-red-500 font-medium">Exceeded by {percentage}%. Your category limit is of ₺{amount.toLocaleString('tr-TR')}</span>
                    </p>
                </div>

                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-red-600 h-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}