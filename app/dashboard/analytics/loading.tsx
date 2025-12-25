import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

export default function loading() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full">
                    <Skeleton className="h-24 w-full rounded-xl bg-white/10 backdrop-blur-md" />
                </div>

                <div className="w-full sm:w-[300px]">
                    <Skeleton className="h-32 w-full rounded-xl bg-white/10 backdrop-blur-md" />
                </div>
            </div>

            <div className="space-y-6">
                <Skeleton className="h-[350px] w-full rounded-xl bg-white/5 backdrop-blur-sm" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-[200px] rounded-xl bg-white/5" />
                    <Skeleton className="h-[200px] rounded-xl bg-white/5" />
                </div>
            </div>
        </div>
    );
}