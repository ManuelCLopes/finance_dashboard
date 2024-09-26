export function getChartOptions() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
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
        animation: { duration: 1000, easing: 'easeInOutCubic' },
        layout: { padding: { left: 10, right: 10, top: 20, bottom: 20 } },
    };
}

export function getPieChartOptions() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: { size: 14, family: 'Roboto', style: 'bold' },
                    color: isDarkMode ? '#FAFAFA' : '#333',
                },
            },
        },
        animation: { duration: 1000, easing: 'easeInOutCubic' },
    };
}
