export function getBarChartOptions() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const labelColor = isDarkMode ? '#FAFAFA' : '#333';

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: { size: 14, family: 'Roboto', style: 'bold' },
                    color: labelColor,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: isDarkMode ? '#333' : '#fff',
                titleColor: isDarkMode ? '#FAFAFA' : '#333',
                bodyColor: isDarkMode ? '#FAFAFA' : '#666',
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
                },
                ticks: { 
                    color: labelColor
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: isDarkMode ? '#555' : '#eee'
                },
                ticks: { 
                    color: labelColor
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

export function getPieChartOptions() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const colors = isDarkMode ? ['#3498db', '#2ecc71', '#e74c3c'] : ['#f39c12', '#e67e22', '#d35400'];

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
                    color: isDarkMode ? '#FAFAFA' : '#333'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: isDarkMode ? '#333' : '#fff',
                titleColor: isDarkMode ? '#FAFAFA' : '#333',
                bodyColor: isDarkMode ? '#FAFAFA' : '#666',
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
        datasets: [{
            backgroundColor: colors
        }]
    };
}

export function getLineChartOptions() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDarkMode ? '#3498db' : '#f39c12';
    const pointColor = isDarkMode ? '#2ecc71' : '#e67e22';

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: { size: 14, family: 'Roboto', style: 'bold' },
                    color: isDarkMode ? '#FAFAFA' : '#333',
                },
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#333' : '#fff',
                titleColor: isDarkMode ? '#FAFAFA' : '#333',
                bodyColor: isDarkMode ? '#FAFAFA' : '#666',
            },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                grid: { color: isDarkMode ? '#555' : '#eee' },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutCubic'
        },
        datasets: [{
            borderColor: lineColor,
            pointBackgroundColor: pointColor
        }]
    };
}
