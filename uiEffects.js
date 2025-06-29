// Background effects and animations moved from index.html
function initPokerBackground() {
  const pokerBackground = document.createElement('div');
  pokerBackground.className = 'poker-background';
  const pokerElements = document.createElement('div');
  pokerElements.className = 'poker-elements';
  const controllerIcons = ['fa-gamepad', 'fa-dice', 'fa-chess', 'fa-puzzle-piece', 'fa-headset', 'fa-trophy', 'fa-coins'];
  
  // Reduce number of elements on mobile
  const elementCount = window.innerWidth < 768 ? 3 : 12;
  
  for (let i = 0; i < elementCount; i++) {
    const controller = document.createElement('i');
    controller.className = `controller fas ${controllerIcons[Math.floor(Math.random() * controllerIcons.length)]}`;
    controller.style.top = `${Math.random() * 80 + 10}%`; // Keep elements more visible
    controller.style.left = `${Math.random() * 80 + 10}%`; // Keep elements more visible
    controller.style.animationDelay = `${Math.random() * 15}s`; // Longer delay range
    controller.style.animationDuration = `${15 + Math.random() * 10}s`; // Variable duration
    controller.style.transform = `rotate(${Math.random() * 360}deg)`;
    controller.style.fontSize = `${60 + Math.random() * 40}px`; // Variable size
    pokerElements.appendChild(controller);
  }
  pokerBackground.appendChild(pokerElements);
  document.body.insertBefore(pokerBackground, document.body.firstChild);
}

function initTitleScreenBackground() {
  const titleScreen = document.getElementById('titleScreen');
  if (!titleScreen) return;
  
  const titlePokerBackground = document.createElement('div');
  titlePokerBackground.className = 'title-poker-background';
  const titlePokerElements = document.createElement('div');
  titlePokerElements.className = 'title-poker-elements';
  const controllerIcons = ['fa-gamepad', 'fa-dice', 'fa-chess', 'fa-puzzle-piece', 'fa-headset', 'fa-trophy', 'fa-coins'];
  
  // Reduce number of elements on mobile
  const elementCount = window.innerWidth < 768 ? 5 : 15;
  
  for (let i = 0; i < elementCount; i++) {
    const controller = document.createElement('i');
    controller.className = `title-controller fas ${controllerIcons[Math.floor(Math.random() * controllerIcons.length)]}`;
    controller.style.top = `${Math.random() * 80 + 10}%`;
    controller.style.left = `${Math.random() * 80 + 10}%`;
    controller.style.animationDelay = `${Math.random() * 15}s`;
    controller.style.animationDuration = `${15 + Math.random() * 10}s`;
    controller.style.transform = `rotate(${Math.random() * 360}deg)`;
    controller.style.fontSize = `${80 + Math.random() * 60}px`;
    titlePokerElements.appendChild(controller);
  }
  titlePokerBackground.appendChild(titlePokerElements);
  titleScreen.appendChild(titlePokerBackground);
}

// Search functionality with debouncing
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const searchTerm = e.target.value.toLowerCase();
            const allGames = await fetchGames();
            const filteredGames = allGames.filter(game => 
                game.title.toLowerCase().includes(searchTerm) || 
                game.description.toLowerCase().includes(searchTerm)
            );
            renderGames(filteredGames);
        }, 300);
    });
}