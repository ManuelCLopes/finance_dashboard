import { fetchDetailedData } from './dataAggregator.js';

export function enableCardClick() {
    const cards = document.querySelectorAll('.chart-card');
    let previouslySelectedCard = null;

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const selectedChartContainer = document.getElementById('selected-chart-container');
            if (!selectedChartContainer) return;

            if (previouslySelectedCard === card) {
                resetLayout();
                previouslySelectedCard = null;
                return;
            }

            if (previouslySelectedCard) {
                previouslySelectedCard.classList.remove('selected-card');
                document.querySelector('.grid-container').appendChild(previouslySelectedCard);
            }

            selectedChartContainer.appendChild(card);
            card.classList.add('selected-card');
            previouslySelectedCard = card;

            document.getElementById('selected-chart-table-container').style.display = 'flex';
            document.getElementById('data-table-container').style.display = 'block';

            fetchDetailedData(card.dataset.table);
        });
    });
}

function resetLayout() {
    const selectedChartContainer = document.getElementById('selected-chart-container');
    const gridContainer = document.querySelector('.grid-container');
    if (selectedChartContainer.children.length > 0) {
        const selectedCard = selectedChartContainer.children[0];
        selectedCard.classList.remove('selected-card');
        gridContainer.appendChild(selectedCard);
    }

    document.getElementById('selected-chart-table-container').style.display = 'none';
    document.getElementById('data-table-container').style.display = 'none';
    gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
}
