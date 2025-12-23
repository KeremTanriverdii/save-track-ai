"use client"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { ChevronDownIcon, Divide, Loader2, Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useReducer, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { CATEGORY_MAP } from "@/lib/types/constants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

type DialogState = {
    amount: number;
    category: string[];
    description: string;
    title: string;
    isLoading: boolean;
    error: string | null;
    date: Date | undefined;
};

type DialogAction =
    | { type: 'POST_START'; payload: { amount: number; category: string; description: string; date: Date | undefined } }
    | { type: 'POST_SUCCESS'; }
    | { type: 'POST_ERROR'; payload: { error: string } }
    | { type: 'SET_FIELD'; field: keyof Omit<DialogState, 'isLoading' | 'error'>; value: any }
    | { type: 'SET_DATE'; payload: Date | undefined };

function dialogFormReducer(state: DialogState, action: DialogAction): DialogState {
    switch (action.type) {
        case 'POST_START':
            return {
                ...state,
                isLoading: true,
                error: null, // Reset error on new attempt
                amount: action.payload.amount,
                category: [action.payload.category], // Ensure category is an array
                description: action.payload.description,
                date: action.payload.date
            }
        case 'POST_SUCCESS':
            return {
                ...state,
                isLoading: false,
                error: null,
            }
        case 'POST_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            }
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'SET_DATE':
            return {
                ...state,
                date: action.payload,
            };
        default:
            return state;
    }
}

const initialNewExpenseForm = {
    amount: 0,
    category: [Object.keys(CATEGORY_MAP)[0]],
    title: '',
    description: '',
    isLoading: false,
    error: null,
    date: undefined,
}

export default function TestAddExpense() {
    const [state, dispatch] = useReducer(dialogFormReducer, initialNewExpenseForm);
    const { category } = state;
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();

    const testAddExpenses = async () => {
        const expenseData = {
            amount: state.amount,
            category: state.category,
            title: state.title,
            description: state.description,
            expenseDate: state.date ? state.date.toISOString() : undefined
        };

        const response = await fetch("/api/expenses", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            alert(`Expense added successfully!`);
            router.refresh()
        } else {
            const error = await response.json();
            console.error("Error adding expense:", error.error);
            alert(`Error: ${error.error}`);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white">
                    <Plus /> New Expense
                </Button>
            </DialogTrigger>
            <DialogClose />
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>New Expense</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    You can add new expenses here.
                </DialogDescription>
                <form onSubmit={testAddExpenses} className="flex flex-col gap-4">
                    <label htmlFor="amount" className="w-full">
                        <span>Amount *</span>
                        <Input
                            type="number"
                            name="amount"
                            value={state.amount}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'amount', value: Number(e.target.value) })}
                        />
                    </label>

                    <label htmlFor="category" className="w-full">
                        <span>Category *</span>
                        <Select
                            disabled={state.isLoading}
                            value={category[0]}
                            onValueChange={(value) => dispatch({ type: 'SET_FIELD', field: 'category', value: [value] })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {Object.entries(CATEGORY_MAP).map(([name]) => {
                                        return (
                                            <SelectItem key={name} value={name}>
                                                <div className="flex items-center gap-2">
                                                    {name}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </label>

                    <label htmlFor="title">
                        <span>Title (optional)</span>
                        <Input
                            type="text"
                            name="title"
                            value={state.title}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
                        />
                    </label>

                    <label htmlFor="description" className="w-full">
                        <span>Description (optional)</span>
                        <Input
                            type="text"
                            name="description"
                            value={state.description}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                        />
                    </label>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="date" className="px-1">
                            Select Date
                        </label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full justify-between font-normal"
                                >
                                    {state.date ? state.date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={state.date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        dispatch({ type: 'SET_DATE', payload: date })
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>


                    <Button className="w-full mt-3" disabled={state.isLoading} type="submit">
                        {state.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {state.isLoading ? "Adding..." : "Add Expense"}
                    </Button>

                    {state.error && <p className="text-red-500">{state.error}</p>}
                </form>
            </DialogContent>
        </Dialog>
    )
}
