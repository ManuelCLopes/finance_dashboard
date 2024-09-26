import { updatePageTheme, updateToggleIcons } from './themeManager.js';
import { aggregateDataByMonth, aggregateIncomeBySource, aggregateExpensesByCategory } from './dataAggregator.js';
import { drawChart, drawPieChart } from './chartManager.js';
import { enableCardClick } from './eventHandlers.js';
import { EXPENSE_COLORS, INVESTMENT_COLORS, COLORS } from './constants.js';

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('theme-switch');
    const sunIcon = document.querySelector('.slider .fa-sun');
    const moonIcon = document.querySelector('.slider .fa-moon');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeSwitch.checked = currentTheme === 'dark';
    updateToggleIcons(currentTheme, sunIcon, moonIcon);
    updatePageTheme(currentTheme);

    themeSwitch.addEventListener('change', function () {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcons(newTheme, sunIcon, moonIcon);
        updatePageTheme(newTheme);
    });

    fetch('/fetch_data/')
        .then(response => response.json())
        .then(data => {
            const aggregatedIncomeData = aggregateDataByMonth(data.incomes);
            const aggregatedIncomesBySource = aggregateIncomeBySource(data.incomes);
            const aggregatedExpenses = aggregateExpensesByCategory(data.expenses);

            drawChart('incomeLineChart', 'line', aggregatedIncomeData, 'Income Over Time', COLORS.DARK_GREEN, COLORS.DARK_GREEN);
            drawChart('incomesChart', 'bar', aggregatedIncomesBySource, 'Income Overview', COLORS.GOLD_LEAF, COLORS.GOLD_LEAF);
            drawChart('expensesChart', 'bar', aggregatedExpenses, 'Expenses by Category', COLORS.NAVY_BLUE, COLORS.NAVY_BLUE);
            drawPieChart('expensesPieChart', aggregatedExpenses, 'Expenses Distribution', EXPENSE_COLORS);
            enableCardClick();
        })
        .catch(error => console.error('Error fetching data:', error));
});
