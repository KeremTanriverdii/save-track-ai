"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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

import { ReturnAPIResponseData } from "@/lib/types/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, HelpCircle, MoreHorizontal, XIcon } from "lucide-react";
import OpenDialogClientComponent from "./OpenDialogClientComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CATEGORY_MAP } from "@/lib/types/constants";
import TestAddExpense from "./TestAddExpense";
import { AnalyticsFiltersClientComponent } from "./AnalyticsFiltersClientComponent";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type Props = {
    data: ReturnAPIResponseData[];
};

export default function DataTableClientComponent({ data }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<ReturnAPIResponseData | null>(null)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const datafilter = searchParams.get('date');

    React.useEffect(() => {
        if (datafilter) {
            setColumnFilters([{ id: 'date', value: datafilter }]);
        } else {
            setColumnFilters([]);
        }
    }, [datafilter])

    const columns = React.useMemo<ColumnDef<ReturnAPIResponseData>[]>(
        () => [
            {
                accessorKey: "description", header: "Description",
                filterFn: (row, columnId, filterValue) => {
                    const title = String(row.original.title ?? "").toLowerCase();
                    const description = String(row.original.description ?? "").toLowerCase();
                    const search = String(filterValue).toLowerCase();

                    return title.includes(search) || description.includes(search);
                },
                cell: ({ row }) => {
                    const { title, description, category } = row.original;
                    const catName = Array.isArray(category) ? category[0] : category;
                    const config = CATEGORY_MAP[catName as string] || { icon: HelpCircle, color: "text-gray-400" };
                    const Icon = config.icon;


                    if (!description && !title) return "N/A";

                    return (
                        <div className={`flex items-center gap-3`}>
                            <div
                                className={`p-2 rounded-full border-white/10 backdrop-blur-md`}
                                style={{
                                    backgroundColor: config.background || 'rgba(255,255,255,0.1)',
                                    color: config.color
                                }}
                            >
                                <Icon size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{title || "Untitled"}</span>
                                <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>
                            </div>
                        </div>
                    );
                },
            }
            , {
                header: "Category",
                accessorKey: "category",
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "all") return true
                    const rowValue = row.getValue(columnId);

                    if (Array.isArray(rowValue)) {
                        return rowValue.includes(filterValue)
                    } else {
                        return String(rowValue) === String(filterValue)
                    }

                }
            }
            , {
                accessorKey: "date",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="hover:bg-transparent p-0 font-bold"
                        >
                            Date
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
                    const dateValue = row.getValue("date");
                    let dateString: string;
                    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue && typeof (dateValue as { seconds: number }).seconds === 'number') {
                        const date = new Date((dateValue as { seconds: number }).seconds * 1000);
                        dateString = date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    } else {
                        dateString = "N/A";
                    }

                    return dateString;
                },
                filterFn: (row, columnId, value) => {
                    const dateValue = row.getValue(columnId) as any;

                    if (!dateValue) return false
                    const rowDateObj = new Date(dateValue.seconds * 1000);
                    const formattedDate = new Date(dateValue.seconds as any * 1000).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });

                    if (typeof value === 'object' && (value.from || value.to)) {
                        const { from, to } = value;
                        if (from && !to) return rowDateObj >= from;
                        if (from && to) return rowDateObj >= from && rowDateObj <= to;
                        return true
                    }

                    return formattedDate.toLowerCase().includes(String(value).toLowerCase());
                }
            },
            {
                accessorKey: "amount",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="hover:bg-transparent p-0 font-extrabold"
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
                    const subscriptionDetails = row.original.subscriptionDetails;
                    const currency = row.original.currency;
                    return <div className="text-left font-extrabold ">{amount.toFixed(2) + `${currency}`}
                        {subscriptionDetails?.status === "active" && (<span className="ms-1">monthly</span>)}
                    </div>;
                },
            },
            {
                id: "subscription",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Subscription
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                accessorKey: "type",
                sortingFn: (rowA, rowB, columnId) => {
                    const getPriority = (row: any) => {
                        const type = row.original.type;
                        const status = row.original.subscriptionDetails?.status;

                        if (type === "subscription") {
                            return status === "active" ? 3 : 2; // Active en öncelikli
                        }
                        return 1; // One-time en az öncelikli
                    };

                    const priorityA = getPriority(rowA);
                    const priorityB = getPriority(rowB);

                    return priorityA > priorityB ? 1 : priorityA < priorityB ? -1 : 0;
                },
                cell: ({ row }) => {
                    const types = row.original.type;
                    const subscription = row.original.subscriptionDetails;
                    if (!types) return null;

                    return (
                        <div className="flex items-center gap-2">
                            {types === "subscription" ? (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={subscription?.status === "active"}
                                        disabled
                                        id={`sub-${row.id}`} // Unique ID kullanımı önemli
                                    />
                                    <Label htmlFor={`sub-${row.id}`}>
                                        {subscription?.status === "active" ? "Active" : "Cancelled"}
                                    </Label>
                                </div>
                            ) : (
                                <Label className="text-muted-foreground italic">One-time paid</Label>
                            )}
                        </div>
                    )

                }
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
        state: {
            columnFilters,
        },
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
            sorting: [
                {
                    id: "date",
                    desc: true,
                }
            ]
        },
    });



    const handleExportCSV = (table: any) => {
        const rows = table.getFilteredRowModel().rows;

        const csvHeaders = ["Title", "Category", "Amount", "Date"].join(",");

        const csvRows = rows.map((row: any) => {
            const d = row.original;
            let dateString = "";
            if (d.date && typeof d.date.seconds === "number") {
                const dateObj = new Date(d.date.seconds * 1000);
                dateString = dateObj.toLocaleDateString();

            }
            const categoryName = Array.isArray(d.category) ? d.category[0] : d.category;
            return [
                `"${(d.title || "Untitled").replace(/"/g, '""')}"`,       // Tırnak işaretlerini kaçıralım
                `"${(d.description || "").replace(/"/g, '""')}"`,
                `"${(categoryName || "N/A")}"`,
                d.amount,
                `"${dateString}"`
            ].join(",");
        });

        const csvString = [csvHeaders, ...csvRows].join("\n");

        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `amount_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 gap-5 me-2 mt-5">
            <div className="flex justify-between items-center">
                <div className='flex flex-col gap-2'>
                    <h2 className='font-bold sm:text-4xl'>Expenses</h2>
                    <p className='text-sm'>Filter, sort, and examine your expenses in detail.</p>
                </div>
                <div className='flex flex-col gap-2 sm:flex-row'>
                    <Button
                        variant="outline"
                        onClick={() => handleExportCSV(table)}
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/20"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export (.CSV)
                    </Button>
                    <TestAddExpense />
                </div>
            </div>
            <AnalyticsFiltersClientComponent table={table} setFilterValue={() => setColumnFilters} />
            <div className="overflow-hidden rounded-md border w-full">
                {datafilter && (
                    <div className="text-end p-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-5"
                            onClick={() => { router.push('/dashboard/expenses'); router.refresh() }}
                        >
                            Clear Filter: {datafilter} <XIcon color="red" />
                        </Button>
                    </div>
                )}
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
                                        <TableCell key={cell.id} className="py-4">
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

                <div className="grid grid-cols-2 gap-2 p-2 border-t">
                    <div className="flex flex-col sm:flex-row gap-2 text-nowrap justify-start md:items-center">
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 25, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm ">
                            Showing expenses {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )}{" "}
                            of {table.getFilteredRowModel().rows.length}
                        </span>
                    </div>
                    <div className="space-x-2 space-y-2 ms-auto">
                        <Button
                            className="w-full sm:w-fit"
                            variant='outline'
                            size='sm'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            className="w-full sm:w-fit"
                            variant='outline'
                            size='sm'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {selected && (
                    <OpenDialogClientComponent data={selected} open={open} setOpen={setOpen} />
                )}
            </div>
        </div>
    );
}
