import { lightenColor } from './colorUtils.js';

export function drawChart(canvasId, chartType, chartData, label, bgColor, borderColor, chartOptions) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

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
            }],
        },
        options: chartOptions
    });
}

export function drawPieChart(canvasId, chartData, label, colors, chartOptions) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

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
        options: chartOptions
    });
}
