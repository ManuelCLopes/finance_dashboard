import { getChartOptions, getPieChartOptions } from './chartOptions.js';
import { lightenColor } from './colorUtils.js';

export function drawChart(canvasId, chartType, chartData, label, bgColor, borderColor) {
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
                hoverBorderColor: lightenColor(borderColor, 20),
            }],
        },
        options: getChartOptions(),
    });
}

export function drawPieChart(canvasId, chartData, label, colors) {
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
