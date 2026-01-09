"use client"
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteReportButtonComponent from "./DeleteReportButtonComponent";

interface ExpandableListProps {
    items: {
        id: string;
        data: {
            createdAt: { _seconds: number, _nanoseconds: number }
            insight: {
                summary: string;
                suggestions: string[];
                risks: string[];
                patterns: string[];
                dataTable: {
                    columns: { accessorKey: string, header: string }[],
                    rows: {
                        day: number,
                        title: string,
                        category?: string,
                        exceeded?: boolean,
                        percentage?: string,
                        threshold: number
                        amount?: number
                    }
                }
            }
        }
    }[]
}


export default function ExpandableList({ items }: ExpandableListProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const initialLimit = 3;

    const displayedItems = isExpanded ? items : items.slice(0, initialLimit);
    return (
        <div className="space-y-2">
            <ul className="space-y-1">
                {displayedItems.map((item: ExpandableListProps['items'][number]) => (
                    <div className="flex justify-between items-start" key={item.id}>
                        <Link href={`/dashboard/ai-coach/details/${item.id}`} className="p-2 text-white flex">
                            {new Date(item.data.createdAt._seconds * 1000).toLocaleDateString()}
                        </Link>
                        <DeleteReportButtonComponent id={item.id} />
                    </div>
                ))}
            </ul>

            {items.length > initialLimit && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-500 hover:underline text-sm font-medium"
                >
                    {isExpanded ? "Show less" : `Show more (${items.length - initialLimit} report)`}
                </button>
            )}
        </div>
    );
}