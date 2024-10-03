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
                // When data is available, trigger the animation and hide the QR code
                handleDataAvailable();
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

// This function will handle the UI changes when data is available
function handleDataAvailable() {
    // Hide the QR code section and display the charts
    document.getElementById('qr-code-container').style.display = 'none';
    document.getElementById('charts-container').style.display = 'block';

    // Trigger the animation for the title moving to the navbar
    moveTitleToNavbar();
}

// Animate the "Finance Dashboard" title to move to the navbar
function moveTitleToNavbar() {
    const title = document.getElementById('title');
    const navbar = document.querySelector('.navbar');

    // Add CSS class to trigger animation (CSS needed in styles)
    title.classList.add('move-to-navbar');

    // After the animation, append the title to the navbar
    setTimeout(() => {
        navbar.appendChild(title);
    }, 1000); // Adjust timeout based on your animation duration
}
