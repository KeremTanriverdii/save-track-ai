"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import { MoreHorizontal } from "lucide-react";
import OpenDialogClientComponent from "./OpenDialogClientComponent";

type Props = {
    data: Expenses[];
};

export default function DataTableClientComponent({ data }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<Expenses | null>(null)

    const columns = React.useMemo<ColumnDef<Expenses>[]>(
        () => [
            { header: "Amount", accessorKey: "amount" },
            { header: "Category", accessorKey: "category" },
            { header: "Description", accessorKey: "description" },
            {
                header: "Date",
                accessorKey: "date",
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
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const expense = row.original; // <- satırın gerçek verisi

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Actions">
                                    <MoreHorizontal />
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
                                    onClick={() => {
                                        // örn: delete confirm aç
                                        console.log("DELETE", expense);
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
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
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
