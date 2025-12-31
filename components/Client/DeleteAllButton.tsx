"use client"

import { deleteAllExpense } from "@/lib/expenses/deleteAllExpense";
import ReAuthDialog from "./ReAuthDialog";
import { Button } from "../ui/button";

export default function DeleteAllButton({ data }: { data: any }) {
    return (
        <ReAuthDialog onSuccess={deleteAllExpense}>
            <Button variant={'destructive'} disabled={data.length === 0}>
                Delete All Expense
            </Button>

        </ReAuthDialog>
    )
}
