// Fetch cards from the API and render them
async function loadCards() {
    try {
        const response = await fetch('/api/cards');
        const cards = await response.json();
        const cardContainer = document.getElementById('card-container');

        cards.forEach(card => {
            const cardElement = createCardElement(card);
            cardContainer.appendChild(cardElement);
        });
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

// Create a card element with front and back sides
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    // Front side of the card
    const front = document.createElement('div');
    front.classList.add('card-front');

    const title = document.createElement('h2');
    title.textContent = card.title;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    fetch(`/api/cards/${card.slug}/svg`)
        .then(response => response.json())
        .then(data => {
            imageContainer.innerHTML = data.result; // Access SVG with the 'result' key
        })
        .catch(error => console.error('Error loading SVG:', error));

    front.appendChild(imageContainer);
    front.appendChild(title);

    // Back side of the card
    const back = document.createElement('div');
    back.classList.add('card-back');

    const description = document.createElement('p');
    description.textContent = card.description;

    const link = document.createElement('a');
    link.href = card.url;
    link.textContent = 'Learn more';
    link.target = '_blank';

    back.appendChild(description);
    back.appendChild(link);

    // Append front and back to card
    cardElement.appendChild(front);
    cardElement.appendChild(back);

    // Add click event to flip the card
    cardElement.addEventListener('click', () => {
        cardElement.classList.toggle('flipped');
    });

    return cardElement;
}

// Load cards on page load
document.addEventListener('DOMContentLoaded', loadCards);
