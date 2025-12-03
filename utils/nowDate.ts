export const dateCustom = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const yearMonth = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    return yearMonth
}