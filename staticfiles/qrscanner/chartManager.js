import { drawChart, drawPieChart } from './chartUtils.js';
import { getBarChartOptions, getPieChartOptions, getLineChartOptions } from './chartOptions.js';
import { aggregateDataByMonth, aggregateIncomeBySource, aggregateExpensesByCategory, aggregateInvestmentsByCategory } from './dataAggregator.js';
import { EXPENSE_COLORS, INVESTMENT_COLORS, COLORS } from './constants.js';


let charts = [];

export function updateChartColors() {
    charts.forEach(chart => chart.destroy());
    charts = [];

    checkForData();
}

export function checkForData() {
    fetch('/fetch_data/')
        .then(response => response.json())
        .then(data => {
            if (data.data_available) {
                renderCharts(data);
            } else {
                setTimeout(checkForData, 5000);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

export function renderCharts(data) {
    const aggregatedIncomeData = aggregateDataByMonth(data.incomes);
    const aggregatedIncomesBySource = aggregateIncomeBySource(data.incomes);
    const aggregatedExpenses = aggregateExpensesByCategory(data.expenses);
    const aggregatedInvestments = aggregateInvestmentsByCategory(data.investments);

    charts.push(drawChart('incomeLineChart', 'line', aggregatedIncomeData, 'Income Over Time', COLORS.DARK_GREEN, COLORS.DARK_GREEN, getLineChartOptions()));
    charts.push(drawChart('incomesChart', 'bar', aggregatedIncomesBySource, 'Income Overview', COLORS.GOLD_LEAF, COLORS.GOLD_LEAF, getBarChartOptions()));
    charts.push(drawChart('expensesChart', 'bar', aggregatedExpenses, 'Expenses by Category', COLORS.NAVY_BLUE, COLORS.NAVY_BLUE, getBarChartOptions()));
    charts.push(drawPieChart('expensesPieChart', aggregatedExpenses, 'Expenses Distribution', EXPENSE_COLORS, getPieChartOptions()));
    charts.push(drawChart('investmentsChart', 'bar', aggregatedInvestments, 'Investments Breakdown', COLORS.TEAL, COLORS.TEAL, getBarChartOptions()));
    charts.push(drawPieChart('investmentsPieChart', aggregatedInvestments, 'Investments Distribution', INVESTMENT_COLORS, getPieChartOptions()));
}
