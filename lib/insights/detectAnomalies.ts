import { calculateMean, calculateStdDev } from "@/utils/calculateMean";
import { DailyChartData, DetectAnomalies } from "../types/type";

export function detectAnomalies(dailyExpenses: DailyChartData[]) {
    if (!dailyExpenses || dailyExpenses.length === 0) return [];
    if (dailyExpenses.length < 7) return [];
    // Get amounts
    const amounts = dailyExpenses.map(item => item.amount)

    // Calculate statistic's
    const mean = calculateMean(amounts);
    const stdDev = calculateStdDev(amounts, mean);

    // stdDev length is 0 return empty array
    if (stdDev === 0) return []

    // If average is greater 2 being anomaly 
    // Mean: average + (2 * S)

    const THRESHOLD_MULTIPLIER = 2;
    const anomalyThreshold = mean + (THRESHOLD_MULTIPLIER * stdDev);

    // Return analyze value
    return dailyExpenses.map(item => {
        return {
            ...item,
            isAnomaly: item.amount > anomalyThreshold,
            stats: {
                mean: Math.round(mean),
                threshold: Math.round(anomalyThreshold)
            }
        }
    }) as DetectAnomalies[]


}