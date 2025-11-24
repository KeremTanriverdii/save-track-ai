import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics'

async function fetchMonthlyData(yearMonth: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}/api/expenses?yearMonth=${yearMonth}`;

    const res = await fetch(fullUrl, {
        cache: 'no-store'
    });

    if (!res.ok) {
        // Hata durumunda uygun şekilde ele alın
        throw new Error(`API isteği başarısız oldu: ${res.status}`);
    }
    return res.json();
}

export default async function page() {
    const date = new Date().toISOString().substring(0, 7);
    const currentMonth = date

    const expensesData = await fetchMonthlyData(currentMonth)
    return (
        <div>
            analitycs
            <div>month select area client</div>
            <div>daily chart client</div>
            <div>summaryCards server <br />
                <ChartAnalytics data={expensesData} />
            </div>
            <div>InsightPanel server</div>
        </div>
    )
}
