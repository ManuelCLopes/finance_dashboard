export function aggregateDataByMonth(incomeData) {
    if (!incomeData || !incomeData.sources || !Array.isArray(incomeData.sources)) {
        console.error('Invalid income data:', incomeData);
        return { labels: [], values: [] };
    }

    const monthlyData = {};
    incomeData.sources.forEach(item => {
        const yearPattern = /\s\d{4}$/;
        if (yearPattern.test(item.source)) return;

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
        values: sortedEntries.map(entry => entry[1]),
    };
}

export function aggregateIncomeBySource(incomeData) {
    if (!incomeData || !incomeData.sources || !Array.isArray(incomeData.sources)) {
        console.error('Invalid income data:', incomeData);
        return { labels: [], values: [] };
    }

    const sourceTotals = {};
    incomeData.sources.forEach(item => {
        const source = item.source;
        const yearPattern = /\s\d{4}$/;
        if (yearPattern.test(source)) return;

        const value = parseFloat(item.amount);
        if (!isNaN(value)) {
            sourceTotals[source] = (sourceTotals[source] || 0) + value;
        }
    });

    const sortedSources = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedSources.map(item => item[0]),
        values: sortedSources.map(item => item[1]),
    };
}

export function aggregateExpensesByCategory(expenses) {
    if (!expenses || !expenses.labels || !expenses.values) {
        console.error('Invalid expenses data:', expenses);
        return { labels: [], values: [] };
    }

    const categoryTotals = {};
    expenses.labels.forEach((label, index) => {
        const value = parseFloat(expenses.values[index]);
        if (!isNaN(value)) {
            categoryTotals[label] = (categoryTotals[label] || 0) + value;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedCategories.map(item => item[0]),
        values: sortedCategories.map(item => item[1]),
    };
}

export function aggregateInvestmentsByCategory(investments) {
    if (!investments || !investments.labels || !investments.values) {
        console.error('Invalid investments data:', investments);
        return { labels: [], values: [] };
    }

    const categoryTotals = {};
    investments.labels.forEach((label, index) => {
        const value = parseFloat(investments.values[index]);
        if (!isNaN(value)) {
            categoryTotals[label] = (categoryTotals[label] || 0) + value;
        }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedCategories.map(item => item[0]),
        values: sortedCategories.map(item => item[1]),
    };
}

export function fetchDetailedData(tableType) {
    fetch(`/fetch_detailed_data/?type=${tableType}`)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error fetching detailed data:', error));
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
