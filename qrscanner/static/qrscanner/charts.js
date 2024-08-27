document.addEventListener('DOMContentLoaded', function () {
    checkForData();

    function checkForData() {
        fetch('/fetch_data/')
            .then(response => response.json())
            .then(data => {
                if (data.data_available) {
                    document.getElementById('qr-code-container').style.display = 'none';
                    document.getElementById('charts-container').style.display = 'block';
                    renderCharts(data);
                } else {
                    setTimeout(checkForData, 5000);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderCharts(data) {
        drawChart('expensesChart', 'bar', data.expenses, 'Expenses', '#FF6384', '#FF6384');
        drawChart('incomesChart', 'bar', data.incomes, 'Incomes', '#36A2EB', '#36A2EB');
        drawChart('investmentsChart', 'bar', data.investments, 'Investments', '#4BC0C0', '#4BC0C0');
        drawPieChart('expensesPieChart', data.expenses, 'Expenses Distribution');
        drawLineChart('incomeLineChart', data.incomes, 'Income Over Time');
        drawStackedBarChart('investmentsStackedBarChart', data.investments);
    }

    function drawChart(canvasId, chartType, chartData, label, bgColor, borderColor) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
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

    function drawPieChart(canvasId, chartData, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: label,
                    data: chartData.values,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                    ],
                    hoverBackgroundColor: [
                        lightenColor('#FF6384', 20),
                        lightenColor('#36A2EB', 20),
                        lightenColor('#FFCE56', 20),
                        lightenColor('#4BC0C0', 20)
                    ],
                    borderWidth: 2
                }]
            },
            options: getPieChartOptions()
        });
    }

    function drawLineChart(canvasId, chartData, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: label,
                    data: chartData.values,
                    fill: false,
                    borderColor: '#36A2EB',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: getLineChartOptions()
        });
    }

    function drawStackedBarChart(canvasId, chartData) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Investment Type 1',
                    data: chartData.values,
                    backgroundColor: '#4BC0C0',
                    borderColor: '#4BC0C0',
                    borderWidth: 2
                }, {
                    label: 'Investment Type 2',
                    data: chartData.values.map(value => value / 2),
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
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
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ddd'
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
                        color: '#eee'
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
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ddd'
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            }
        };
    }

    function getLineChartOptions() {
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
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ddd'
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
                        color: '#eee'
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
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    borderWidth: 1,
                    borderColor: '#ddd'
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
});
