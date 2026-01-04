import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '../ui/card';
import { WeeklyTrendResult } from '@/lib/insights/detectWeeklyTrend';

interface TrendProps {
    trendData?: WeeklyTrendResult[];
    latestData: WeeklyTrendResult;
    displayData: WeeklyTrendResult[];
    currency: string;
}

export default function TrendComponent({ latestData, displayData, currency }: TrendProps) {
    return (
        <Card className="w-full p-6 rounded-3xl text-white shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        {latestData?.isRising ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Weekly Trend</h2>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${latestData?.status === 'Stabilizing' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    latestData?.status === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                    {latestData?.status}
                </div>
            </div>

            <div className="space-y-6 mb-6">
                {displayData.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{item.week}</p>
                            <div className="flex items-center gap-2">
                                {item.isBaseline ? (
                                    <span className="text-lg font-semibold text-white">No Change (0%)</span>
                                ) : (
                                    <>
                                        {item.isRising ? (
                                            <TrendingUp className="text-red-400 w-5 h-5" />
                                        ) : (
                                            <TrendingDown className="text-green-400 w-5 h-5" />
                                        )}
                                        <span className={`text-lg font-semibold ${item.isRising ? 'text-red-400' : 'text-green-400'}`}>
                                            {item.changeRate}% {item.isRising ? 'Increase' : 'Decrease'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            {item.isBaseline ? (
                                <span className="text-gray-500 font-medium">Baseline</span>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-xs mb-1">Projected Impact</p>
                                    <p className={`font-semibold ${item.impactAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.impactAmount >= 0 ? '+' : ''}{currency}{Math.abs(item.impactAmount)} {item.impactAmount >= 0 ? 'Saving' : 'Loss'}
                                    </p>
                                </>
                            )}
                        </div>
                        <br />
                        <hr className='w-full col-span-2' />
                    </div>
                ))}
            </div>

            {latestData && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-md mt-auto">
                    <p className="text-blue-100/90 text-sm leading-relaxed">
                        <span className="font-semibold text-blue-200">Insight: </span>
                        {latestData.insight}
                    </p>
                </div>
            )}
        </Card>
    )
}
