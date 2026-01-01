"use client"
import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { SubscriptionStatus } from '@/lib/types/type'
import { FormDataType } from './OpenDialogClientComponent'
import { cn } from '@/lib/utils'
import { format, isValid } from 'date-fns'

interface Props {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export default function UpdateSubscriptionForm({ formData, setFormData, onSubmit, loading }: Props) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <h2 className="text-xl font-bold text-emerald-400">Edit Subscription</h2>

            {/* Title Field */}
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10 focus:ring-blue-500/50"
                />
            </div>

            {/* Status & Frequency Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as SubscriptionStatus })}>
                        <SelectTrigger className="bg-white/5 border-white/10 w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(val) => setFormData({ ...formData, frequency: val })}
                        disabled={formData.status !== 'active'}
                    >
                        <SelectTrigger className="bg-white/5 border-white/10 w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Date Picker (Local Open State ile) */}
            <div className="space-y-2 flex flex-col">
                <Label>First Payment Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild disabled={formData.status !== 'active'}>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                                !formData.date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date && isValid(new Date(formData.date)) ?
                                format(new Date(formData.date), "PPP")
                                : <span>Pick a date</span>
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => {

                                if (date) {
                                    setFormData({ ...formData, date: date });
                                    setIsCalendarOpen(false);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="bg-white/5 border-white/10"
                    disabled={formData.status !== 'active'}
                />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input
                    id="desc"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="pt-4">
                <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
