import { updatePageTheme, updateToggleIcons } from './themeManager.js';
import { updateChartColors, checkForData, renderCharts } from './chartManager.js';
import { enableCardClick } from './eventHandlers.js';

// Função para tentar buscar os dados de forma repetida até ter sucesso
function fetchDataWithRetry() {
    fetch('/fetch_data/')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data); // Verifica os dados retornados

            // Verifica se os dados de incomes e expenses estão disponíveis
            if (data && data.incomes && data.expenses) {
                renderCharts(data);
                enableCardClick();

                // Mostra o contêiner dos gráficos e esconde o contêiner do QR code
                document.getElementById('qr-code-container').style.display = 'none';
                document.getElementById('charts-container').style.display = 'block';
            } else {
                // Se os dados não estiverem completos, tenta novamente após 5 segundos
                console.error('Data not available yet, retrying in 5 seconds...');
                setTimeout(fetchDataWithRetry, 5000);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Se houver erro na requisição, tenta novamente após 5 segundos
            setTimeout(fetchDataWithRetry, 5000);
        });
}

// Chama a função de inicialização assim que a página carregar
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
        updateChartColors();
    });

    // Inicializa a tentativa de buscar os dados
    fetchDataWithRetry();
});

