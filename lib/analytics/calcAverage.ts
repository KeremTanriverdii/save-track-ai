
export const calcAverage = (dailySpendingData: { day: string, amount: number }[]): number => {

    if (!dailySpendingData || dailySpendingData.length === 0) {
        return 0;
    }

    const totalAmount = dailySpendingData.reduce((acc, curr) => {
        return acc + curr.amount;
    }, 0);
    if (totalAmount === 0) {
        return 0;
    }

    // Get the day of current month 
    const daaDate = new Date(dailySpendingData[0].day);
    const dataYearMonth = `${daaDate.getFullYear()}-${daaDate.getMonth() + 1}`;
    // For current month's previous month

    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;
    console.log('current year month: ', currentYearMonth);

    let divisorDays: number;

    // const average = totalAmount / currentDayOfMonth;
    if (dataYearMonth === currentYearMonth) {
        divisorDays = today.getDate();
    } else {
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        divisorDays = lastDayOfMonth.getDate();
        console.log('last day of month ' + divisorDays)

    }

    const average = totalAmount / divisorDays;
    return parseFloat(average.toFixed(2));
}