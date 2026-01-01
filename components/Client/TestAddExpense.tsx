"use client"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { CalendarIcon, ChevronDownIcon, Divide, Loader2, Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useReducer, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { CATEGORY_MAP } from "@/lib/types/constants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";
import { formatDate } from "./AnalyticsFiltersClientComponent";
import { toast } from "sonner";

export type DialogState = {
    amount: number;
    category: string[];
    description: string;
    title: string;
    isLoading: boolean;
    error: string | null;
    date: Date | undefined;
    type: string;
    frequency: string;
    startDate: Date;

};

type DialogAction =
    | { type: 'POST_START'; }
    | { type: 'POST_SUCCESS'; }
    | { type: 'POST_ERROR'; payload: { error: string } }
    | { type: 'SET_FIELD'; field: keyof Omit<DialogState, 'isLoading' | 'error'>; value: any }
    | { type: 'SET_DATE'; payload: Date | undefined }
    | { type: 'RESET_FORM' }

function dialogFormReducer(state: DialogState, action: DialogAction): DialogState {
    switch (action.type) {
        case 'POST_START':
            return {
                ...state,
                isLoading: true,
                error: null, // Reset error on new attempt
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
        case 'RESET_FORM':
            return {
                ...initialNewExpenseForm,
                isLoading: false,
                error: null,
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
    subscription: undefined,
    type: "one-time",
    frequency: "monthly",
    startDate: new Date(),
}

export default function TestAddExpense() {
    const [state, dispatch] = useReducer(dialogFormReducer, initialNewExpenseForm);
    const { category } = state;
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const router = useRouter();
    const isSubscription = state.type === 'subscription'

    const testAddExpenses = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'POST_START' });
        try {
            const expenseData = {
                amount: state.amount,
                category: state.category,
                title: state.title,
                description: state.description,
                // New Date sync
                type: state.type, // "subscription" or "one-time"

                // Date logic
                expenseDate: state.type === "subscription"
                    ? state.startDate.toISOString()
                    : state.date ? state.date.toISOString() : new Date().toISOString(),

                // subscription obj
                subscription: state.type === "subscription" ? {
                    frequency: state.frequency,
                    startDate: state.startDate.toISOString(),
                    billingDay: state.startDate.getDate(),
                    billingMonth: state.startDate.getMonth() + 1,
                    status: "active",
                } : null
            };

            const response = await fetch("/api/expenses", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });

            if (response.ok) {
                toast.success("Expense added successfully!");
                dispatch({ type: 'RESET_FORM' });
                setOpenDialog(false);
                router.refresh()
            } else {
                const error = await response.json();
                console.error("Error adding expense:", error.error);
                dispatch({ type: 'POST_ERROR', payload: { error: error.error } });
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            alert(`Error: ${error}`);
        }
    }
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger onClick={() => setOpenDialog(true)} asChild>
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
                {/* Switch for subscription */}
                <div className="flex flex-col gap-y-5 space-x-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="subscription-mode"
                            checked={isSubscription}
                            onCheckedChange={(checked) =>
                                dispatch({ type: 'SET_FIELD', field: 'type', value: checked ? "subscription" : "one-time" })
                            }
                        />
                        <label htmlFor="subscription-mode">Is this a recurring subscription?</label>
                    </div>
                    {isSubscription && <p className="text-muted-foreground">* This expense will be automatically added to your financial statements each month until you cancel it.</p>}
                </div>
                {/* Form Begining */}
                <form onSubmit={testAddExpenses} className="flex flex-col gap-4">
                    <label htmlFor="amount" className="w-full">
                        {state.type === "subscription" ? <span>Monthly subscription amount *</span> : <span>Amount *</span>}
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
                        {isSubscription ? <span>Title *(Your Subscription Title)</span> : <span>Title *</span>}
                        <Input
                            type="text"
                            name="title"
                            value={state.title}
                            required
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
                    {!isSubscription ? (
                        // Not subscription UI
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
                    ) :
                        // Subscription UI
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 items-center">
                            <div className="flex flex-col gap-2 w-full">
                                {/* Frequency Select Input */}
                                <label>Frequency</label>
                                <Select value={state.frequency} onValueChange={(val) => dispatch({ type: 'SET_FIELD', field: 'frequency', value: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Paid Input */}
                            <div className="flex flex-col gap-2">
                                <label>Fist Paid Date</label>
                                <Popover>
                                    <PopoverTrigger asChild >
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {state.startDate ? formatDate(state.startDate) : <span>Select Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={state.startDate}
                                            onSelect={(date) => {
                                                if (date) {
                                                    dispatch({ type: 'SET_FIELD', field: 'startDate', value: date });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    }
                    {/* Submit Button with loading state */}
                    <Button className="w-full mt-3" disabled={state.isLoading} type="submit">
                        {state.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {state.isLoading ? "Adding..." : "Add Expense"}
                    </Button>
                    {/* Error Message */}
                    {state.error && <p className="text-red-500">{state.error}</p>}
                </form>
                {/* Form End */}
            </DialogContent>
        </Dialog>
    )
}
