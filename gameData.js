const ALL_GAMES_URL = 'https://gamemonetize.com/feed.php?format=0&category=15&num=50&page=1';

async function fetchGames(apiUrl = ALL_GAMES_URL) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const apiGames = data.map(game => ({
            title: game.title,
            url: game.url,
            thumbnail: game.thumb,
            source: "GameMonetize",
            description: game.description || "No description available"
        }));
        
        // Check if Velocity Puck already exists in API response
        const velocityPuckExists = apiGames.some(game => 
            game.title === "Velocity Puck" || 
            game.url.includes("jll9bmbb1qxr1uux1t1khn56z4xpvibs")
        );
        
        let allGames = [...apiGames];
        
        // Only add Velocity Puck manually if it doesn't exist in API response
        if (!velocityPuckExists) {
            const velocityPuck = {
                title: "Velocity Puck",
                url: "https://html5.gamemonetize.com/jll9bmbb1qxr1uux1t1khn56z4xpvibs/",
                thumbnail: "https://img.gamemonetize.com/jll9bmbb1qxr1uux1t1khn56z4xpvibs/512x384.jpg",
                source: "GameMonetize",
                description: "Fast-paced hockey action game with realistic physics and smooth gameplay."
            };
            allGames.push(velocityPuck);
        }
        
        return allGames.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
        console.error('Error fetching games:', error);
        // Return only Velocity Puck if API fails
        return [{
            title: "Velocity Puck",
            url: "https://html5.gamemonetize.com/jll9bmbb1qxr1uux1t1khn56z4xpvibs/",
            thumbnail: "https://img.gamemonetize.com/jll9bmbb1qxr1uux1t1khn56z4xpvibs/512x384.jpg",
            source: "GameMonetize",
            description: "Fast-paced hockey action game with realistic physics and smooth gameplay."
        }];
    }
}

function createGameCard(game) {
    // Abbreviate the description
    const maxLength = 100;
    const abbreviatedDescription = game.description.length > maxLength ?
        game.description.substring(0, maxLength) + '...' :
        game.description;

    // Generate random rating and review count for demonstration
    const rating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0-5.0
    const reviewCount = Math.floor(Math.random() * 5000 + 100); // Reviews between 100-5100
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Generate star display
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }

    return `
        <div class="game-card">
            <img src="${game.thumbnail}" alt="${game.title} thumbnail" class="game-thumbnail">
            <button class="play-button" onclick="openGame('${game.url}')">Play</button>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${abbreviatedDescription}</p>
                <div class="game-meta">
                    <span class="source-badge">${game.source}</span>
                    <div class="rating-component">
                        <div class="stars" title="${rating} out of 5 stars">
                            ${starsHtml}
                        </div>
                        <div class="review-count">(${reviewCount.toLocaleString()} reviews)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderGames(gamesArray) {
    const container = document.getElementById('gamesContainer');
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    gamesArray.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.innerHTML = createGameCard(game);
        fragment.appendChild(gameElement.firstElementChild);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}