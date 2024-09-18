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
    
        // Aggregate expenses by category
        const aggregatedExpenses = aggregateExpensesByCategory(data.expenses);
        console.log('Aggregated Expenses:', aggregatedExpenses); // Log aggregated data for debugging
    
        // Render each chart as before, but use aggregatedExpenses for the expenses chart
        charts.push(drawChart('expensesChart', 'bar', aggregatedExpenses, 'Expenses by Category', colors.expense, colors.expense));
        charts.push(drawChart('incomesChart', 'bar', data.incomes, 'Incomes', colors.income, colors.income));
        charts.push(drawChart('investmentsChart', 'bar', data.investments, 'Investments', colors.investment, colors.investment));
        charts.push(drawPieChart('expensesPieChart', aggregatedExpenses, 'Expenses Distribution', [colors.expense, colors.income]));
        charts.push(drawLineChart('incomeLineChart', aggregateDataByMonth(data.incomes), 'Income Over Time', colors.line));
        charts.push(drawStackedBarChart('investmentsStackedBarChart', data.investments, [colors.investmentType1, colors.investmentType2]));
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

        return {
            labels: Object.keys(categoryTotals),
            values: Object.values(categoryTotals)
        };
    }

    function aggregateDataByMonth(data) {
        if (typeof data !== 'object' || !Array.isArray(data.labels) || !Array.isArray(data.values)) {
            console.error('Data format is incorrect:', data);
            return { labels: [], values: [] };
        }
    
        const monthlyData = {};
        const labels = data.labels;
        const values = data.values.map(value => parseFloat(value)); // Convert string to number
    
        labels.forEach((label, index) => {
            // Assuming label is in format 'Salário' or similar, need to extract date from index or another structure if possible
            // Here I will assume a dummy date, you need to replace this with actual date extraction logic
            const date = new Date(); // Replace with actual logic to extract date
            const month = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
    
            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }
    
            monthlyData[month] += values[index]; // Aggregate values by month
        });
    
        console.log('Monthly Data Aggregation:', monthlyData); // Log to debug aggregation
    
        return {
            labels: Object.keys(monthlyData),
            values: Object.values(monthlyData)
        };
    }
    
    

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
                    backgroundColor: colors,
                    hoverBackgroundColor: colors.map(color => lightenColor(color, 20)),
                    borderWidth: 2
                }]
            },
            options: getPieChartOptions()
        });
    }

    function drawLineChart(canvasId, chartData, label, borderColor) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
    
        // Set canvas height and width dynamically if needed
        canvas.height = 400;  // Set your desired height
        canvas.width = canvas.parentElement.offsetWidth;  // Match the parent's width if desired
    
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: label,
                    data: chartData.values,
                    fill: false,
                    borderColor: borderColor,
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: getLineChartOptions()
        });
    }
    

    function drawStackedBarChart(canvasId, chartData, colors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Investment Type 1',
                    data: chartData.values,
                    backgroundColor: colors[0],
                    borderColor: colors[0],
                    borderWidth: 2
                }, {
                    label: 'Investment Type 2',
                    data: chartData.values.map(value => value / 2),
                    backgroundColor: colors[1],
                    borderColor: colors[1],
                    borderWidth: 2
                }]
            },
            options: getStackedBarChartOptions()
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
        console.log('Chart cards found:', cards.length);
    
        let previouslySelectedCard = null;
    
        cards.forEach(card => {
            card.addEventListener('click', function () {
                console.log('Card clicked:', card);
    
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
                console.log('Detailed data fetched:', data);
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

        console.log('Populating table with data:', tableData);

        if (!Array.isArray(tableData) || tableData.length === 0) {
            console.log('No data available for table');
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

        console.log('Table populated with data:', tableData);
    }
});
