"use client"

import { ReturnAPIResponseData } from '@/lib/types/type'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { useRouter } from 'next/navigation'

import UpdateOneTimeForm from './UpdateOneTimeForm'
import UpdateSubscriptionForm from './UpdateSubscriptionForm'


type status = 'active' | 'cancelled' | 'expired';
export interface FormDataType {
    amount?: number;
    category: string;
    description: string;
    title: string;
    status?: status;
    frequency?: string;
    date?: Date;
}

export default function OpenDialogClientComponent(
    { data, open, setOpen }: {
        data: ReturnAPIResponseData,
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) {
    if (!data.description) {
        throw new Error('No description')
    }

    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        amount: data.amount,
        category: data.category?.[0] || "General",
        description: data.description || "",
        title: data.title || "",
        status: data.subscriptionDetails?.status || 'active',
        frequency: data.subscriptionDetails?.frequency || 'monthly',
        date: new Date(data.date.seconds * 1000),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let dataToSubmit = { ...formData };
        if (data.type === 'one-time') {
            delete dataToSubmit.status;
            delete dataToSubmit.frequency;
        }

        if (data.type === 'subscription' && formData.status === 'cancelled') {
            delete dataToSubmit.frequency;
            delete dataToSubmit.date;
            delete dataToSubmit.amount;
        }

        try {
            const response = await fetch(`/api/expenses`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: data.id,
                    expenseData: dataToSubmit
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            router.refresh();
            setOpen(false);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className='sm:max-w-[500px]'>
                {/* One-Time paid update form */}
                {data.type === 'one-time' ? (

                    <UpdateOneTimeForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleUpdate}
                        loading={loading}
                    />
                ) :
                    <UpdateSubscriptionForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleUpdate}
                        loading={loading}
                    />
                }
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                <DialogTitle className='hidden'></DialogTitle>
                <DialogDescription className='hidden'></DialogDescription>
            </DialogContent>

        </Dialog>
    )
}
