export function calculateMean(data: number[]): number {
    if (data.length === 0) return 0;

    // numbers is sum with reduce method.
    const sum = data.reduce((total, current) => total + current, 0);

    return sum / data.length;
}

// 2. Calculate (STD DEV)

export function calculateStdDev(data: number[], mean: number): number {
    if (data.length === 0) return 0;

    // A. Square the difference between each number and the mean 
    const squareDiffs = data.map(value => {
        const diff = value - mean;
        return diff * diff; // Take Square for convert the negative numbers to positife numbers
    });

    // B. Take varyans this square 
    const avgSquareDiff = calculateMean(squareDiffs);

    // C. Take Square root (STD)
    return Math.sqrt(avgSquareDiff);
}