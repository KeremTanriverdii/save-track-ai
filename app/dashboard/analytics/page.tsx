import { ChartAnalytics } from '@/components/Client/Charts/ChartAnalytics'
import { getMonthlyAnalytics, getMonthlyRawAnalyticsData } from './action';
import AnalyticsClientWrapperComponent from '@/components/Client/AnalyticsPageWrapper';


async function initialFetch() {
    const date = new Date().toISOString().substring(0, 7);
    const currentMonth = date

    try {
        const initialData = await getMonthlyAnalytics(currentMonth);
        return { initialData, currentMonth };
    } catch (error) {
        console.error("First fetch error:", error);
        return {
            initialData: {
                dailyData: [],
                totalSpending: 0,
                averageSpending: 0,
                mostSpendingCategory: null
            },
            currentMonth
        };
    }
}

async function initialInsightPanelDataFetch() {
    const date = new Date().toISOString().substring(0, 7);
    const currentMonthInsigth = date

    try {
        const initialDataInsight = await getMonthlyRawAnalyticsData(currentMonthInsigth)
        return { initialDataInsight, currentMonthInsigth }
    } catch (error) {
        console.error("First fetch error:", error);
        return {
        }
    }
}

export default async function page() {
    const { initialData, currentMonth } = await initialFetch();

    return (
        <AnalyticsClientWrapperComponent initialData={initialData} currentMonth={currentMonth} />
    )
}