"use client"

import { Expenses } from '@/lib/types/type'
import React, { JSX } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { CATEGORY_MAP } from '@/lib/types/constants'
import { useRouter } from 'next/navigation'


export default function OpenDialogClientComponent(
    { data, open, setOpen }: {
        data: Expenses,
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) {
    if (!data.description) {
        throw new Error('No description')
    }
    let initialTitle = data.title;
    if (!initialTitle) initialTitle = "";

    const [newAmount, setNewAmount] = React.useState<number>(data.amount)
    const [newCategory, setNewCategory] = React.useState<string>(data.category)
    const [newDescription, setNewDescription] = React.useState<string>(data.description)
    const [newTitle, setNewTitle] = React.useState<string>(initialTitle);
    const [error, setError] = React.useState<string>('')
    const router = useRouter();
    const uptadeFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newExpensesData = {
            amount: newAmount,
            category: newCategory,
            description: newDescription,
            title: newTitle,
        }
        const fetchRequest = await fetch(`/api/expenses`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: data.id, expenseData: newExpensesData, }),
        });
        if (!fetchRequest.ok) {
            setError('Something went wrong! Please try again.')
        }
        router.refresh()
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-[500px]'>
                <form onSubmit={uptadeFormSubmit}>

                    <DialogHeader>
                        <DialogTitle>Update your expense</DialogTitle>
                        <DialogDescription>
                            Make changes to your expense. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-4'>
                        <div className='grid gap-3'>
                            <label htmlFor="category">Category</label>
                            <Select
                                value={Array.isArray(newCategory) ? newCategory[0] : newCategory}
                                onValueChange={(value) => setNewCategory(value)}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder={Array.isArray(data.category) ? data.category[0] : data.category} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                        {Object.entries(CATEGORY_MAP).map(([name, item]) => (
                                            <SelectItem key={name} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="amount">Amount</label>
                            <Input
                                type='number'
                                id='amount'
                                name='amount'
                                value={newAmount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAmount(e.target.value as unknown as number)}
                            />
                        </div>

                        <div>
                            <label htmlFor="title">Title</label>
                            <Input
                                type='text'
                                id='title'
                                name='title'
                                value={newTitle}
                                placeholder={initialTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Description</label>
                            <Input
                                type='text'
                                id='description'
                                name='description'
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>


                        <div className='flex justify-end gap-5'>
                            <Button
                                onClick={() => setOpen(false)}
                                variant='outline'
                            >Cancel
                            </Button>

                            <Button type='submit'>Save</Button>
                        </div>
                    </div>
                    {error && (<div>{error}</div>)}
                </form>
            </DialogContent>
        </Dialog>
    )
}
