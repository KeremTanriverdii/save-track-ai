"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { useTransition } from "react";

export default function MonthSelectClientComponent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentParam = searchParams.get("yearMonth") || format(new Date(), "yyyy-MM");
    const [year, month] = currentParam.split("-");
    const [isPending, startTransition] = useTransition()

    const updateUrl = (newYear: string, newMonth: string) => {
        startTransition(() => {

            const params = new URLSearchParams(searchParams.toString());
            params.set("yearMonth", `${newYear}-${newMonth}`);
            router.push(`?${params.toString()}`);
        })
    };

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());
    const months = [
        { v: "01", l: "January" }, { v: "02", l: "February" }, { v: "03", l: "March" },
        { v: "04", l: "April" }, { v: "05", l: "May" }, { v: "06", l: "June" },
        { v: "07", l: "July" }, { v: "08", l: "August" }, { v: "09", l: "September" },
        { v: "10", l: "October" }, { v: "11", l: "November" }, { v: "12", l: "December" }
    ];

    return (
        <div className="flex gap-2">
            <Select value={month} onValueChange={(v) => updateUrl(year, v)}>
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m) => (
                        <SelectItem key={m.v} value={m.v}>{m.l}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={year} onValueChange={(v) => updateUrl(v, month)}>
                <SelectTrigger className="w-[100px] bg-white/5 border-white/10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
