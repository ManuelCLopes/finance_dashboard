document.addEventListener('DOMContentLoaded', function () {
    // Define constants for colors
    const COLOR_HOT_CHOCOLATE = '#592E2D';
    const COLOR_GOLD_LEAF = '#A57C55';
    const COLOR_TEAL = '#008080';
    const COLOR_DARK_GREEN = '#004B3A';
    const COLOR_BLACK_COFFEE = '#3B3029';
    const COLOR_NAVY_BLUE = '#2C3E50';
    const COLOR_DARK_GOLDENROD = '#B8860B';
    const COLOR_ALABASTER = '#FAFAFA';
    const COLOR_WHITE = '#FFFFFF';
    const COLOR_BURGUNDY = '#B00020';
    const COLOR_PALE_WHITE = 'rgba(254, 251, 245, 1)';
    const COLOR_TAN = '#B39B72';
    const COLOR_DARK_GRAY = '#2C2C2C';
    const COLOR_DIM_GRAY = '#696969';
    const COLOR_JET_BLACK = 'rgba(14, 9, 0, 1)';
    const COLOR_CHARCOAL = '#1C1C1C';

    let charts = []; // Array to store chart instances

    const themeSwitch = document.getElementById('theme-switch');
    const sunIcon = document.querySelector('.slider .fa-sun');
    const moonIcon = document.querySelector('.slider .fa-moon');

    // Load theme preference from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeSwitch.checked = currentTheme === 'dark';
    updateToggleIcons(currentTheme);
    updatePageTheme(currentTheme);

    themeSwitch.addEventListener('change', function () {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcons(newTheme); // Update icons when theme changes
        updatePageTheme(newTheme); // Update page elements for the new theme
        updateChartColors(); // Update chart colors based on the new theme
    });

    function updateToggleIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.opacity = '0';
            moonIcon.style.opacity = '1';
        } else {
            sunIcon.style.opacity = '1';
            moonIcon.style.opacity = '0';
        }
    }

    function updatePageTheme(theme) {

        document.documentElement.setAttribute('data-theme', theme);

        // Apply styles to non-chart elements based on the current theme
        document.body.style.backgroundColor = theme === 'dark' ? COLOR_CHARCOAL : COLOR_ALABASTER;
        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
        });
        document.querySelectorAll('.card-header').forEach(header => {
            header.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
        });
        document.querySelectorAll('.card-title, .lead').forEach(text => {
            text.style.color = theme === 'dark' ? COLOR_ALABASTER : '#333';
        });

        // Update table styles dynamically
        document.querySelectorAll('#data-table-container').forEach(container => {
            container.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
            container.style.color = theme === 'dark' ? COLOR_ALABASTER : '#333';
        });
        document.querySelectorAll('#table-container').forEach(container => {
            container.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
            container.style.color = theme === 'dark' ? COLOR_ALABASTER : '#333';
        });
        document.querySelectorAll('.table').forEach(table => {
            table.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
        });
        document.querySelectorAll('.table th, .table td').forEach(cell => {
            cell.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_WHITE;
            cell.style.color = theme === 'dark' ? COLOR_ALABASTER : '#333';
        });
        document.querySelectorAll('.table tr:nth-child(even)').forEach(row => {
            row.style.backgroundColor = theme === 'dark' ? COLOR_DARK_GRAY : COLOR_LIGHT_GRAY;
        });
    }

    function updateChartColors() {
        // Clear existing charts
        charts.forEach(chart => chart.destroy());
        charts = [];

        // Re-fetch data and re-render charts with new theme colors
        checkForData();
    }

    // Initialize data fetching
    checkForData();

    function checkForData() {
        fetch('/fetch_data/')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data); // Log fetched data for debugging
                if (data.data_available) {
                    document.getElementById('qr-code-container').style.display = 'none';
                    document.getElementById('charts-container').style.display = 'block';
                    renderCharts(data);
                    enableCardClick(data);
                } else {
                    setTimeout(checkForData, 5000);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderCharts(data) {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const colors = getThemeColors(theme);
    
        // Verifica se o incomeData.sources está definido antes de mapear
        if (data.incomes && data.incomes.sources) {
            const aggregatedIncomeData = aggregateDataByMonth(data.incomes);
            console.log('Aggregated Income Data:', aggregatedIncomeData);
            charts.push(drawLineChartForIncome('incomeLineChart', aggregatedIncomeData)); 
        } else {
            console.error('Invalid income data:', data.incomes);
        }
    
        // Outros gráficos e dados agregados
        const aggregatedExpenses = aggregateExpensesByCategory(data.expenses);
        const aggregatedInvestments = aggregateDataByCategory(data.investments);
        const aggregatedIncomesBySource = aggregateIncomeBySource(data.incomes);
        
        charts.push(drawChart('incomesChart', 'bar', aggregatedIncomesBySource, 'Income Overview', colors.income, colors.income));
        charts.push(drawChart('expensesChart', 'bar', aggregatedExpenses, 'Expenses by Category', colors.expense, colors.expense));
        charts.push(drawChart('investmentsChart', 'bar', aggregatedInvestments, 'Investments', colors.investment, colors.investment));
        charts.push(drawPieChart('expensesPieChart', aggregatedExpenses, 'Expenses Distribution', EXPENSE_COLORS));
        charts.push(drawPieChart('investmentsPieChart', aggregatedInvestments, 'Investments Distribution', INVESTMENT_COLORS));
    }    

    function aggregateDataByMonth(incomeData) {
        const monthlyData = {};
    
        incomeData.sources.forEach((item) => {
            const yearPattern = /\s\d{4}$/;
            if (yearPattern.test(item.source)) {
                return;
            }
            const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(item.date); 
        
            if (!isValidDate) {
                console.error(`Ignoring non-date entry: ${item.date}`);
                return;
            }
        
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
            values: sortedEntries.map(entry => entry[1])
        };
    }    
           
    
    function aggregateExpensesByCategory(expenses) {
        if (!expenses || !expenses.labels || !expenses.values) {
            console.error('Invalid expenses data:', expenses);
            return { labels: [], values: [] };
        }

        const categoryTotals = {};
        expenses.labels.forEach((label, index) => {
            const value = parseFloat(expenses.values[index]);
            if (!isNaN(value)) {
                if (categoryTotals[label]) {
                    categoryTotals[label] += value;
                } else {
                    categoryTotals[label] = value;
                }
            }
        });

        // Sort categories by value in descending order
        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]);

        return {
            labels: sortedCategories.map(item => item[0]),
            values: sortedCategories.map(item => item[1])
        };
    }
    
    function aggregateDataByCategory(data, excludeYearPattern = false) {
        if (!data || !data.labels || !data.values) {
            console.error('Invalid data:', data);
            return { labels: [], values: [] };
        }

        const categoryTotals = {};
        data.labels.forEach((label, index) => {
            // Exclude categories ending with a year pattern (e.g., "xxx 2024")
            if (excludeYearPattern && /\s\d{4}$/.test(label)) {
                return;
            }

            const value = parseFloat(data.values[index]);
            if (!isNaN(value)) {
                if (categoryTotals[label]) {
                    categoryTotals[label] += value;
                } else {
                    categoryTotals[label] = value;
                }
            }
        });

        // Sort categories by value in descending order
        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]);

        return {
            labels: sortedCategories.map(item => item[0]),
            values: sortedCategories.map(item => item[1])
        };
    }

    function aggregateIncomeBySource(incomeData) {
        if (!incomeData || !incomeData.sources || !Array.isArray(incomeData.sources)) {
            console.error('Invalid income data:', incomeData);
            return { labels: [], values: [] };
        }
    
        const sourceTotals = {};
    
        incomeData.sources.forEach((item) => {
            const source = item.source;

            const yearPattern = /\s\d{4}$/;
            if (yearPattern.test(source)) {
                return;
            }

            const value = parseFloat(item.amount);
    
            if (!isNaN(value)) {
                sourceTotals[source] = (sourceTotals[source] || 0) + value;
            }
        });
    
        const sortedSources = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1]);
    
        return {
            labels: sortedSources.map(item => item[0]),
            values: sortedSources.map(item => item[1])
        };
    }
    
    const EXPENSE_COLORS = [
        '#592E2D', // COLOR_HOT_CHOCOLATE
        '#A57C55', // COLOR_GOLD_LEAF
        '#008080', // COLOR_TEAL
        '#004B3A', // COLOR_DARK_GREEN
        '#3B3029', // COLOR_BLACK_COFFEE
        '#2C3E50', // COLOR_NAVY_BLUE
        '#B8860B', // COLOR_DARK_GOLDENROD
        '#B00020', // COLOR_BURGUNDY
        '#B39B72', // COLOR_TAN
        '#2C2C2C', // COLOR_DARK_GRAY
        '#696969', // COLOR_DIM_GRAY
        '#1C1C1C', // COLOR_CHARCOAL
        '#4A412A', // Darker variation of GOLD_LEAF
        '#006666', // Darker variation of TEAL
        '#23282D', // Darker variation of NAVY_BLUE
        '#8B4513', // SaddleBrown
        '#800000', // Maroon
        '#556B2F', // DarkOliveGreen
        '#483D8B', // DarkSlateBlue
        '#2F4F4F'  // DarkSlateGray
    ];

    const INVESTMENT_COLORS = [
        '#2F4F4F', // Dark Slate Gray
        '#8B4513', // Saddle Brown
        '#4A412A', // Dark Olive
        '#373737', // Jet Black
        '#1C1C1C', // Eerie Black
        '#3C2F2F', // Dark Liver
        '#4B3621', // Cafe Noir
        '#3D3635', // Black Coffee
        '#2C3539', // Gunmetal
        '#3B3C36', // Black Olive
        '#26252D', // Raisin Black
        '#3C341F', // Olive Drab
        '#2C3333', // Charcoal
        '#2D2926', // Onyx
        '#32174D', // Russian Violet
    ];

    function getThemeColors(theme) {
        if (theme === 'dark') {
            return {
                expense: COLOR_HOT_CHOCOLATE,
                income: COLOR_GOLD_LEAF,
                investment: COLOR_TEAL,
                line: COLOR_DARK_GREEN,
                investmentType1: COLOR_TAN,
                investmentType2: COLOR_DARK_GRAY
            };
        } else {
            return {
                expense: COLOR_NAVY_BLUE,
                income: COLOR_DARK_GOLDENROD,
                investment: COLOR_TEAL,
                line: COLOR_DARK_GREEN,
                investmentType1: COLOR_GOLD_LEAF,
                investmentType2: COLOR_ALABASTER
            };
        }
    }

    function drawChart(canvasId, chartType, chartData, label, bgColor, borderColor) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: chartType,
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: label,
                    data: chartData.values,
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: 2,
                    hoverBackgroundColor: lightenColor(bgColor, 20),
                    hoverBorderColor: lightenColor(borderColor, 20)
                }]
            },
            options: getChartOptions()
        });
    }

    function drawPieChart(canvasId, chartData, label, colors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: label,
                    data: chartData.values,
                    backgroundColor: colors.slice(0, chartData.labels.length),
                    hoverBackgroundColor: colors.slice(0, chartData.labels.length).map(color => lightenColor(color, 20)),
                    borderWidth: 2
                }]
            },
            options: getPieChartOptions()
        });
    }

    function drawLineChartForIncome(canvasId, chartData) {
        console.log(chartData);
        const ctx = document.getElementById(canvasId).getContext('2d');
    
        // Convert chartData.labels from "YYYY-MM" to Date objects
        const labels = chartData.labels.map(label => {
            return new Date(label + '-01'); // Append day to make it a valid date
        });
    
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Income Over Time',
                    data: chartData.values,
                    fill: false,
                    borderColor: 'blue',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            tooltipFormat: 'MMM YYYY',
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Income Amount'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }    

    function lightenColor(color, percent) {
        const num = parseInt(color.slice(1), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
        return `rgb(${(R < 255 ? R < 1 ? 0 : R : 255)},${(G < 255 ? G < 1 ? 0 : G : 255)},${(B < 255 ? B < 1 ? 0 : B : 255)})`;
    }

    function getChartOptions() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Roboto',
                            style: 'bold'
                        },
                        color: isDarkMode ? COLOR_ALABASTER : '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    titleColor: isDarkMode ? COLOR_ALABASTER : '#333',
                    bodyColor: isDarkMode ? COLOR_ALABASTER : '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ddd'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? '#555' : '#eee'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 20
                }
            }
        };
    }

    function getPieChartOptions() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Roboto',
                            style: 'bold'
                        },
                        color: isDarkMode ? COLOR_ALABASTER : '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    titleColor: isDarkMode ? COLOR_ALABASTER : '#333',
                    bodyColor: isDarkMode ? COLOR_ALABASTER : '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ddd'
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            }
        };
    }

    function getLineChartOptions() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Roboto',
                            style: 'bold'
                        },
                        color: isDarkMode ? COLOR_ALABASTER : '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    titleColor: isDarkMode ? COLOR_ALABASTER : '#333',
                    bodyColor: isDarkMode ? COLOR_ALABASTER : '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ddd'
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkMode ? '#555' : '#eee'
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 20
                }
            }
        };
    }

    function getStackedBarChartOptions() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Roboto',
                            style: 'bold'
                        },
                        color: isDarkMode ? COLOR_ALABASTER : '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    titleColor: isDarkMode ? COLOR_ALABASTER : '#333',
                    bodyColor: isDarkMode ? COLOR_ALABASTER : '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ddd'
                }
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 20
                }
            }
        };
    }

    function enableCardClick() {
        const cards = document.querySelectorAll('.chart-card');
        let previouslySelectedCard = null;
    
        cards.forEach(card => {
            card.addEventListener('click', function () {
    
                const selectedChartContainer = document.getElementById('selected-chart-container');
                if (!selectedChartContainer) {
                    console.error('Selected chart container not found!');
                    return;
                }
    
                // If the same card is clicked again, reset the layout
                if (previouslySelectedCard === card) {
                    resetLayout();
                    previouslySelectedCard = null;
                    return;
                }
    
                // If there was a previously selected card, reset its style
                if (previouslySelectedCard) {
                    previouslySelectedCard.classList.remove('selected-card');
                    document.querySelector('.grid-container').appendChild(previouslySelectedCard);
                }
    
                // Add the selected card to the selected chart container
                selectedChartContainer.appendChild(card);
                card.classList.add('selected-card');  // Add class to make the card full width
                previouslySelectedCard = card;
    
                document.getElementById('selected-chart-table-container').style.display = 'flex';
                document.getElementById('data-table-container').style.display = 'block';
                
                fetchDetailedData(card.dataset.table);
                adjustGridLayout(card);
            });
        });
    }
    
    function resetLayout() {
        const selectedChartContainer = document.getElementById('selected-chart-container');
        const gridContainer = document.querySelector('.grid-container');
        if (selectedChartContainer.children.length > 0) {
            const selectedCard = selectedChartContainer.children[0];
            selectedCard.classList.remove('selected-card');  // Remove class when resetting
            gridContainer.appendChild(selectedCard);
        }
    
        document.getElementById('selected-chart-table-container').style.display = 'none';
        document.getElementById('data-table-container').style.display = 'none';
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }

    function fetchDetailedData(tableType) {
        fetch(`/fetch_detailed_data/?type=${tableType}`)
            .then(response => response.json())
            .then(data => {
                populateTable(data);
            })
            .catch(error => console.error('Error fetching detailed data:', error));
    }

    function adjustGridLayout(selectedCard) {
        const gridContainer = document.querySelector('.grid-container');
        const chartCards = document.querySelectorAll('.chart-card');

        chartCards.forEach(card => {
            if (card !== selectedCard) {
                gridContainer.appendChild(card);
            }
        });

        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }

    function populateTable(tableData) {
        const tableHeaders = document.getElementById('table-headers');
        const tableBody = document.getElementById('table-body');

        tableHeaders.innerHTML = '';
        tableBody.innerHTML = '';

        if (!Array.isArray(tableData) || tableData.length === 0) {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.textContent = 'No data available';
            noDataCell.colSpan = '100%';
            noDataRow.appendChild(noDataCell);
            tableBody.appendChild(noDataRow);
            return;
        }

        const columnMapping = {
            'symbol': 'Symbol',
            'investment_type': 'Type',
            'initial_value': 'Initial Value',
            'current_value': 'Current Value',
            'date_invested': 'Date',
            'investment_product': 'Product',
            'category': 'Category',
            'amount': 'Amount',
            'date_spent': 'Date',
            'date_received': 'Date',
            'tax_amount': 'Tax applied'
        };

        const headers = Object.keys(tableData[0] || {});
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = columnMapping[header] || header;
            tableHeaders.appendChild(th);
        });

        tableData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] !== undefined ? row[header] : '';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
});