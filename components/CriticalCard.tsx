import { AlertCircle, Calendar } from 'lucide-react';
import { Card, CardAction, CardContent } from './ui/card';
import { CATEGORY_MAP } from '@/lib/types/constants';
import { OverSpendArea } from '@/lib/insights/detectOverspendAreas';
import Link from 'next/link';

const getCategoryIcon = (categoryName: string) => {
    const cat = CATEGORY_MAP[categoryName];

    if (cat && cat.icon) {
        return <cat.icon className="w-6 h-6" color={cat.color} />;
    }

    return <AlertCircle className="w-4 h-4 text-gray-400" />;
};

export function CriticalCard(
    { date, category, amount,
        title, isExceeded, threshold,
        percentageExceeded, currency
    }: OverSpendArea) {
    const dateUrlString = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return (
        <Card className="bg-[#121212] border-zinc-800 text-white min-w-[250px] flex-1">
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> <p>{dateUrlString}</p>
                    </span>
                    <div className="p-2 bg-zinc-900 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(category)}
                    </div>
                </div>

                <div className='text-xs'>
                    <h3 className="text-2xl font-bold">{currency}{amount.toLocaleString('tr-TR')}</h3>
                    <div className='flex gap-2 items-center'>
                        <p className="text-zinc-400"> {category}</p>
                        <p className="text-red-500 font-medium">
                            Exceeded by {percentageExceeded}% your daily limit.
                        </p>
                    </div>

                    <CardAction className='mt-2'>
                        <Link className='ms-auto text-blue-500 visited:text-violet-500 text-nowrap'
                            href={`/dashboard/expenses?date=${encodeURIComponent(dateUrlString)}`} passHref>
                            Go the detail
                        </Link>
                    </CardAction>
                </div>

                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-red-600 h-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(percentageExceeded, 100)}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}