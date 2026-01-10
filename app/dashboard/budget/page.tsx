import { BudgetDeclareComponent } from '@/components/Client/Budget/BudgetDeclareComponent'
import BudgetShowComponent from '@/components/Client/Budget/BudgetShowComponent'
import { getUserData } from '@/lib/auth/user'
import { getBudget } from '@/lib/budged/GetBudget'
import { User } from '@/lib/types/type'
import { dateCustom } from '@/utils/nowDate'
import { Metadata } from 'next'

export const metadata: Metadata = ({
    title: 'Budget',
})

export default async function page({
    searchParams
}: {
    searchParams: Promise<{ yearMonth?: string }>
}) {
    const searchParamsData = (await searchParams).yearMonth || dateCustom();
    const user: User | undefined = await getUserData();
    const budgetData = await getBudget(user!.uid, searchParamsData!)
    return (
        <div
            className='grid gap-2  max-w-4xl mx-auto sm:mt-25 mt-7'
        >
            <div>
                <h2 className='2xl:text-4xl font-bold'>Budget Settings</h2>
                <p>Manage your monthly expenses here for limits.</p>
            </div>

            <BudgetShowComponent
                budget={budgetData.budget}
                currency={budgetData.currency}
            />
            <BudgetDeclareComponent
                budget={budgetData.budget}
                currency={budgetData.currency}
            />

        </div>
    )
}
