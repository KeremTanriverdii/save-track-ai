import { calculateMean, calculateStdDev } from "@/utils/calculateMean";
import { DailyChartData, Expense } from "../types/type";

export function detectAnomalies(dailyExpenses: DailyChartData[]) {
    if (!dailyExpenses || dailyExpenses.length === 0) return [];

    // Get amounts
    const amounts = dailyExpenses.map(item => item.amount)

    // Calculate statistic's
    const mean = calculateMean(amounts);
    const stdDev = calculateStdDev(amounts, mean);

    // If average is greater 2 being anomaly 
    // Mean: average + (2 * S)

    const THRESHOLD_MULTIPLIER = 2;
    const anomalyThreshold = mean + (THRESHOLD_MULTIPLIER * stdDev);

    // Return analyze value
    return dailyExpenses.map(item => {
        const isAnomaly = item.amount > anomalyThreshold;
        return {
            ...item,
            isAnomaly: isAnomaly,
            stats: {
                mean: Math.round(mean),
                threshold: Math.round(anomalyThreshold)
            }
        }
    })


}