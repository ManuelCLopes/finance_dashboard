export function aggregateDataByMonth(incomeData) {
    const monthlyData = {};
    incomeData.sources.forEach(item => {
        const yearPattern = /\s\d{4}$/;
        if (yearPattern.test(item.source)) return;

        const date = new Date(item.date);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const value = parseFloat(item.amount);
        if (!isNaN(value)) {
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + value;
        }
    });
    
    const sortedEntries = Object.entries(monthlyData).sort((a, b) => a[0].localeCompare(b[0]));
    return {
        labels: sortedEntries.map(entry => entry[0]),
        values: sortedEntries.map(entry => entry[1]),
    };
}

export function aggregateIncomeBySource(incomeData) {
    if (!incomeData || !incomeData.sources || !Array.isArray(incomeData.sources)) {
        console.error('Invalid income data:', incomeData);
        return { labels: [], values: [] };
    }

    const sourceTotals = {};
    incomeData.sources.forEach(item => {
        const source = item.source;
        const yearPattern = /\s\d{4}$/;
        if (yearPattern.test(source)) return;

        const value = parseFloat(item.amount);
        if (!isNaN(value)) {
            sourceTotals[source] = (sourceTotals[source] || 0) + value;
        }
    });

    const sortedSources = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedSources.map(item => item[0]),
        values: sortedSources.map(item => item[1]),
    };
}

export function aggregateExpensesByCategory(expenses) {
    if (!expenses || !expenses.labels || !expenses.values) {
        console.error('Invalid expenses data:', expenses);
        return { labels: [], values: [] };
    }

    const categoryTotals = {};
    expenses.labels.forEach((label, index) => {
        const value = parseFloat(expenses.values[index]);
        if (!isNaN(value)) {
            categoryTotals[label] = (categoryTotals[label] || 0) + value;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedCategories.map(item => item[0]),
        values: sortedCategories.map(item => item[1]),
    };
}
