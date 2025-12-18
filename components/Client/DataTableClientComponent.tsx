"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Expenses } from "@/lib/types/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import OpenDialogClientComponent from "./OpenDialogClientComponent";
import { useRouter } from "next/navigation";

type Props = {
    data: Expenses[];
};

export default function DataTableClientComponent({ data }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<Expenses | null>(null)
    const router = useRouter()
    const columns = React.useMemo<ColumnDef<Expenses>[]>(
        () => [
            {
                accessorKey: "description", header: "Description",
                cell: ({ row }) => {
                    const expense = row.original;
                    const description = row.getValue("description") as string | null | undefined;
                    if (!description) return "N/A";
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold leading-none">
                                {expense.title || "Untitled"}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {expense.description || "No description provided"}
                            </span>
                        </div>
                    )
                },
            }, { header: "Category", accessorKey: "category" },
            {
                accessorKey: "date",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="hover:bg-transparent p-0 font-bold"
                        >
                            Date
                            {/* Sıralama durumuna göre ikon değişimi (Opsiyonel ama şık durur) */}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                sortingFn: "datetime",
                cell: ({ row }) => {
                    const dateString = row.getValue("date") as string | null | undefined;
                    if (!dateString) return "N/A";

                    const d = new Date(dateString);
                    if (Number.isNaN(d.getTime())) return "N/A";

                    return d.toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                },
            },
            {
                accessorKey: "amount",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="hover:bg-transparent p-0 font-bold"
                        >
                            Amount
                            {isSorted === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : isSorted === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue("amount"));
                    return <div className="text-left font-medium">{amount}</div>;
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const expense = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuItem
                                    onClick={() => {
                                        if (expense.id) navigator.clipboard.writeText(expense.id);
                                    }}
                                >
                                    Copy ID
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setOpen(true);
                                        setSelected(expense);
                                    }}
                                >
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={async () => {
                                        if (!confirm('Are you sure you want to delete this expense?')) return;

                                        const fetchRequest = fetch(`/api/expenses`, {
                                            method: 'DELETE',
                                            body: JSON.stringify({ id: expense.id }),
                                        });
                                        if ((await fetchRequest).ok) {
                                            router.refresh();
                                        } else {
                                            alert(`An error has occurred`);
                                        }
                                    }}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    );
                },
            },

        ],
        [router]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-md border w-full">
            <Table>
                <TableHeader className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {selected && (
                <OpenDialogClientComponent data={selected} open={open} setOpen={setOpen} />
            )}
        </div>
    );
}
