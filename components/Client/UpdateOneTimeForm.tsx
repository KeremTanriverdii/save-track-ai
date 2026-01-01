"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { SelectItem } from '@radix-ui/react-select';
import { CATEGORY_MAP } from '@/lib/types/constants';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormDataType } from './OpenDialogClientComponent';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
interface Props {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export default function UpdateOneTimeForm({ formData, setFormData, onSubmit, loading }: Props) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    console.log(formData.date && isValid(new Date(formData.date)) ?
        format(new Date(formData.date), "PPP")
        : <span>Pick a date</span>
    )
    return (
        <form onSubmit={onSubmit} className="space-y-5 pt-2">
            <div className="space-y-1 mb-4">
                <h2 className="text-xl font-bold text-emerald-400">One-Time Expense</h2>
                <p className="text-xs text-gray-400">Update your spending details.</p>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                    key={formData.category}
                    value={formData.category || ''}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger id="category" className=" w-full">
                        <SelectValue >
                            {formData.category || "Select a category"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(CATEGORY_MAP).map(cat => (
                            <SelectItem key={cat} value={cat} className='text-white'>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                />
            </div>

            {/* Date Picker */}
            <div className="space-y-2 flex flex-col">
                <Label>Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal bg-white/5 border-white/10",
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
                                    setFormData({ ...formData, date: date })
                                    setIsCalendarOpen(false)
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Amount */}
            <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="bg-white/5 border-white/10 text-lg font-bold"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>Description</Label>
                <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                />
            </div>

            <Button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
                {loading ? "Updating..." : "Update Expense"}
            </Button>
        </form>
    )
}
