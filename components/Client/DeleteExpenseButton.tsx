"use client"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
export const DeleteExpenseButton = ({ id }: { id: string }) => {
    const router = useRouter();


    const handleDeleteRequest = async (id: string) => {
        const fetchReq = await fetch(`/api/expenses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        if (fetchReq.ok) {
            router.refresh();
        } else {
            const error = await fetchReq.json();
            console.error("Gider silinirken hata oluştu:", error.error);
            alert(`Hata: ${error.error}`);
        }
    }

    return (
        <div className="flex justify-between border p-2">
            <Button
                onClick={() => handleDeleteRequest(id)}
                className="bg-red-500 text-white px-2 rounded"
            >
                Sil
            </Button>
        </div>
    )
}