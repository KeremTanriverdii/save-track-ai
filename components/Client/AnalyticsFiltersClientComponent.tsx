"use client"

import * as React from "react"
import { CalendarIcon, Search, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "../ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { CATEGORY_MAP } from "@/lib/types/constants"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"

export function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export function AnalyticsFiltersClientComponent({ table }: { table: any, setFilterValue: React.Dispatch<React.SetStateAction<string>> }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("In 2 days")
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })

    const router = useRouter();

    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);

        if (range?.from) {
            table.getColumn("date")?.setFilterValue(range);
        } else {
            table.getColumn("date")?.setFilterValue(undefined);
        }
    }

    const handleClearAll = () => {
        table.resetColumnFilters();
        setDateRange(undefined);
        setValue("");

        router.push('/dashboard/expenses');
        router.refresh();
    }

    return (
        <Card>
            {/* grid column depends on table value */}
            <CardContent className={`grid grid-cols-1 gap-2 ${table.getState().columnFilters.length > 0 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
                {/* Search Input */}
                <div className="w-full">
                    Search
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Expense name, shop name or descrip.."
                            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("description")?.setFilterValue(event.target.value)
                            }
                            className="w-full pl-8"
                        />
                    </div>
                </div>
                {/* Date Range Filter Input */}
                <div className="w-full flex flex-col gap-1">
                    <span className="text-sm font-medium">Date Range</span>
                    <div className="relative">
                        <Input
                            readOnly
                            value={
                                dateRange?.from
                                    ? `${formatDate(dateRange.from)} - ${dateRange.to ? formatDate(dateRange.to) : ""}`
                                    : "Select date range"
                            }
                            className="bg-background pr-10 cursor-pointer"
                            onClick={() => setOpen(true)}
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0 hover:bg-transparent"
                                >
                                    <CalendarIcon className="size-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={handleDateSelect}
                                    numberOfMonths={2}
                                />
                                {dateRange?.from && (
                                    <div className="p-2 border-t flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDateSelect(undefined)}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {/* Category Filter Input */}
                <div className="w-full">
                    Category
                    <Select onValueChange={(value) => {
                        table.getColumn("category")?.setFilterValue(value === "all" ? undefined : value);
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                {Object.entries(CATEGORY_MAP).map(([name, item]) => {
                                    return (
                                        <SelectItem key={name} value={name}
                                        >
                                            <div className="flex items-center gap-2">
                                                {name}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* Show filter clear button if have filter */}
                {table.getState().columnFilters.length > 0 && (
                    <div className="flex flex-col gap-2 justify-end pt-2 w-full self-end h-full">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleClearAll}
                            className="hover:text-red-500 transition-colors w-full h-full p-2"
                        >
                            <XIcon className="mr-2 h-4 w-4" />
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
