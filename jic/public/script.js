async function fetchCards() {
    try {
        const response = await fetch('/api/cards');
        const cards = await response.json();
        displayCards(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
}

async function fetchCardSVG(slug) {
    try {
        const response = await fetch(`/api/cards/${slug}/svg`);
        const data = await response.json();
        return data.result; // Returns SVG HTML string
    } catch (error) {
        console.error(`Error fetching SVG for ${slug}:`, error);
        return null;
    }
}

async function displayCards(cards) {
    const container = document.getElementById('card-container');
    container.innerHTML = ''; // Clear any existing cards

    for (const card of cards) {
        const svgHTML = await fetchCardSVG(card.slug);

        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    ${svgHTML ? svgHTML : '<p>Image not available</p>'}
                    <h3>${card.title}</h3>
                </div>
                <div class="card-back">
                    <p>${card.description}</p>
                    <a href="${card.url}" class="card-link" target="_blank">Learn More</a>
                </div>
            </div>
        `;

        container.appendChild(cardElement);
    }
}

fetchCards();
