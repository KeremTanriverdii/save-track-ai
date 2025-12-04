"use client"
import { DeleteIcon } from 'lucide-react';
import { Button } from '../ui/button';

const deleteReport = async (id: string) => {
    confirm('Do you want delete this report?')
    const response = await fetch('/api/ai', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

}

export default function DeleteReportButtonComponent({ id }: { id: string }) {
    return (
        <Button onClick={() => deleteReport(id)}> <DeleteIcon /> </Button>
    )
}
