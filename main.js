async function initializeApp() {
    initPokerBackground();
    initializeSearch();
    
    const initialGames = await fetchGames();
    renderGames(initialGames);

    // App Menu functionality
    const appMenuButton = document.querySelector('.app-menu-button');
    const appSidePanel = document.querySelector('.app-side-panel');
    const appMenuItems = document.querySelectorAll('.app-menu-item');

    appMenuButton.addEventListener('click', () => {
        appMenuButton.classList.toggle('active');
        appSidePanel.classList.toggle('open');
    });

    appMenuItems.forEach((item) => {
        item.addEventListener('click', () => {
            appMenuButton.classList.remove('active');
            appSidePanel.classList.remove('open');
        });
    });
}

window.addEventListener('DOMContentLoaded', initializeApp);

// Genre filtering
async function loadGameFeed(apiUrl) {
    try {
        const games = await fetchGames(apiUrl);
        const gamesContainer = document.getElementById('gamesContainer');
        
        // Hide loading state and show games
        gamesContainer.classList.remove('loading');
        renderGames(games);
        closeSideMenu();
    } catch (error) {
        console.error('Error loading games:', error);
        const gamesContainer = document.getElementById('gamesContainer');
        gamesContainer.classList.remove('loading');
        gamesContainer.innerHTML = '<div style="text-align: center; color: var(--primary); padding: 2rem;">Error loading games. Please try again.</div>';
    }
}

//Side menu functionality
function toggleSideMenu() {
    const sideMenu = document.querySelector('.side-menu');
    sideMenu.classList.toggle('open');
}

function closeSideMenu() {
    const sideMenu = document.querySelector('.side-menu');
    sideMenu.classList.remove('open');
}

//Genre list event listener
document.addEventListener('DOMContentLoaded', () => {
    const genreList = document.getElementById('genreList');

    genreList.addEventListener('click', function(e) {
        if (e.target && e.target.tagName === 'A') {
            e.preventDefault();
            const apiUrl = e.target.getAttribute('data-url');
            
            // Show loading state immediately
            const gamesContainer = document.getElementById('gamesContainer');
            gamesContainer.innerHTML = '';
            gamesContainer.classList.add('loading');
            gamesContainer.classList.add('visible');
            
            loadGameFeed(apiUrl);
        }
    });
});

// Message handling
window.addEventListener('message', event => {
    if (event.data && event.data.type === 'volumeStatus') {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeIcon = document.getElementById('volumeIcon');
        volumeSlider.value = event.data.volume * 100;
        volumeIcon.className = event.data.volume > 0 ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
});

//Title Screen and App Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const titleScreen = document.getElementById('titleScreen');
    const enterButton = document.getElementById('enterButton');
    const gamesGrid = document.getElementById('gamesContainer');
    const appMenuItems = document.querySelectorAll('.app-menu-item');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const settingsButton = document.getElementById('settingsButton');
    const settingsPage = document.getElementById('settingsPage');
    const backButton = document.getElementById('backButton');
    const themesButton = document.getElementById('themesButton');
    const themesPage = document.getElementById('themesPage');
    const themesBackButton = document.getElementById('themesBackButton');
    const backToTitleButton = document.getElementById('backToTitleButton');
    const audioButton = document.getElementById('audioButton');
    const audioPage = document.getElementById('audioPage');

    settingsPage.style.display = 'none';
    themesPage.style.display = 'none';
    audioPage.style.display = 'none';

    enterButton.addEventListener('click', () => {
        titleScreen.style.display = 'none';
        gamesGrid.classList.add('visible');
        settingsPage.style.display = 'none';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block'; // Show the fullscreen button

        // Enter fullscreen if not already in fullscreen
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    });

     // Handle "Games" button click in the app menu
     appMenuItems.forEach(item => {
        if (item.textContent === 'Games') {
            item.addEventListener('click', () => {
                titleScreen.style.display = 'none';
                gamesGrid.classList.add('visible');
                settingsPage.style.display = 'none';
                themesPage.style.display = 'none';
                audioPage.style.display = 'none';
                fullscreenButton.style.display = 'block'; // Show the fullscreen button
            });
        }
    });

        // Handle "Settings" button click in the app menu
    settingsButton.addEventListener('click', () => {
        titleScreen.style.display = 'none';
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'block';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block'; // Show the fullscreen button
    });

    backButton.addEventListener('click', () => {
        titleScreen.style.display = 'none';
        gamesGrid.classList.add('visible');
        settingsPage.style.display = 'none';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block'; 
    });

    // Handle "Back to Title" button click in the app menu
    backToTitleButton.addEventListener('click', () => {
        titleScreen.style.display = 'flex';
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'none';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'none'; // Hide the fullscreen button
        
        // Initialize title screen background when returning to title
        initTitleScreenBackground();
    });

    themesButton.addEventListener('click', () => {
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'none';
        themesPage.style.display = 'block';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block'; // Show the fullscreen button
    });

    themesBackButton.addEventListener('click', () => {
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'block';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block'; 
    });

    audioButton.addEventListener('click', () => {
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'none';
        themesPage.style.display = 'none';
        audioPage.style.display = 'block';
        fullscreenButton.style.display = 'block'; 
    });

    // Audio Back button functionality
    const audioBackButton = document.querySelector('#audioPage #backButton'); // Select the Back button within the audioPage
    audioBackButton.addEventListener('click', () => {
        gamesGrid.classList.remove('visible');
        settingsPage.style.display = 'block';
        themesPage.style.display = 'none';
        audioPage.style.display = 'none';
        fullscreenButton.style.display = 'block';
    });

    // Fullscreen functionality
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Initialize title screen background on page load
    initTitleScreenBackground();
});

// Theme Toggle Functionality with optimized DOM updates
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-button');

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
        });
    });

    function applyTheme(themeName) {
        let primaryColor, secondaryColor, backgroundColor, textColor, glowColor, glowColor60, glowColor40;

        switch (themeName) {
            case 'dark':
                primaryColor = '#A9A9A9';
                secondaryColor = '#D3D3D3';
                backgroundColor = '#222';
                textColor = '#A9A9A9';
                glowColor = 'rgba(169, 169, 169, 1)';
                glowColor60 = 'rgba(169, 169, 169, 0.6)';
                glowColor40 = 'rgba(169, 169, 169, 0.4)';
                break;
            case 'light':
                primaryColor = '#696969';
                secondaryColor = '#808080';
                backgroundColor = '#fff';
                textColor = '#696969';
                glowColor = 'rgba(105, 105, 105, 1)';
                glowColor60 = 'rgba(105, 105, 105, 0.6)';
                glowColor40 = 'rgba(105, 105, 105, 0.4)';
                break;
            case 'hacker':
                primaryColor = '#00FF00';
                secondaryColor = '#32CD32';
                backgroundColor = '#000';
                textColor = '#00FF00';
                glowColor = 'rgba(0, 255, 0, 1)';
                glowColor60 = 'rgba(0, 255, 0, 0.6)';
                glowColor40 = 'rgba(0, 255, 0, 0.4)';
                break;
            case 'deus':
                primaryColor = '#FFFF00';
                secondaryColor = '#BDB76B';
                backgroundColor = '#000000';
                textColor = '#FFFF00';
                glowColor = 'rgba(255, 255, 0, 1)';
                glowColor60 = 'rgba(255, 255, 0, 0.6)';
                glowColor40 = 'rgba(255, 255, 0, 0.4)';
                break;
            default:
                // Default (Chrome/Silver)
                primaryColor = '#C0C0C0';
                secondaryColor = '#E8E8E8';
                backgroundColor = '#000000';
                textColor = '#C0C0C0';
                glowColor = 'rgba(192, 192, 192, 1)';
                glowColor60 = 'rgba(192, 192, 192, 0.6)';
                glowColor40 = 'rgba(192, 192, 192, 0.4)';
        }

        // Batch DOM updates for better performance
        const root = document.documentElement;
        root.style.setProperty('--primary', primaryColor);
        root.style.setProperty('--secondary', secondaryColor);
        root.style.setProperty('--background', backgroundColor);
        root.style.setProperty('--text', textColor);
        root.style.setProperty('--glow-color', glowColor);
        root.style.setProperty('--glow-color-60', glowColor60);
        root.style.setProperty('--glow-color-40', glowColor40);
    }
});