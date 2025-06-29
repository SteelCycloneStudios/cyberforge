// All game control functions moved from index.html
function openGame(url) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('modalGameFrame');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    let loadingTimeout = setTimeout(() => {
        const modalControls = document.querySelector('.modal-controls');
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'loading-message';
        loadingMsg.innerHTML = `
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                If the game is taking too long to load, press the <i class="fas fa-redo"></i> button to reload
            </div>
        `;
        modalControls.insertBefore(loadingMsg, modalControls.firstChild);
    }, 10000);
    gameFrame.onload = () => {
        clearTimeout(loadingTimeout);
        const loadingMsg = document.querySelector('.loading-message');
        if (loadingMsg) loadingMsg.remove();
    };
    gameFrame.src = url;
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('modalGameFrame');
    modal.style.display = 'none';
    gameFrame.src = '';
    document.body.style.overflow = 'auto';
    
    // Refocus on gamepad if active
    if (window.gamepadController && window.gamepadController.isActive) {
        setTimeout(() => {
            window.gamepadController.focusFirstElement();
        }, 100);
    }
}

function toggleVolume() {
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider.value > 0) {
        volumeSlider.value = 0;
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        volumeSlider.value = 100;
        volumeIcon.className = 'fas fa-volume-up';
    }
    updateGameVolume(volumeSlider.value);
}

function updateGameVolume(value) {
    const gameFrame = document.getElementById('modalGameFrame');
    try {
        gameFrame.contentWindow.postMessage({
            type: 'setVolume',
            volume: value / 100
        }, '*');
        gameFrame.contentWindow.postMessage({
            action: 'volume',
            value: value / 100
        }, '*');
        const gameAudio = gameFrame.contentWindow.document.getElementsByTagName('audio');
        const gameVideo = gameFrame.contentWindow.document.getElementsByTagName('video');
        [...gameAudio, ...gameVideo].forEach(media => {
            media.volume = value / 100;
        });
    } catch (err) {
        console.log('Volume adjustment attempt:', err);
    }
}

function toggleFullscreen() {
    const modalContent = document.querySelector('.modal-content');
    if (!document.fullscreenElement) {
        modalContent.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function saveGameData() {
    const gameFrame = document.getElementById('modalGameFrame');
    if (gameFrame.contentWindow.postMessage) {
        gameFrame.contentWindow.postMessage({
            type: 'saveGame'
        }, '*');
    }
}

function restartGame() {
    const gameFrame = document.getElementById('modalGameFrame');
    gameFrame.src = gameFrame.src;
}

function shareGame() {
    const gameFrame = document.getElementById('modalGameFrame');
    if (navigator.share) {
        navigator.share({
            title: 'Check out this game!',
            url: gameFrame.src
        }).catch(err => {
            copyToClipboard(gameFrame.src);
        });
    } else {
        copyToClipboard(gameFrame.src);
    }
}

function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        alert('Game link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Could not share or copy game link');
    }
    document.body.removeChild(input);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('volumeSlider').addEventListener('input', e => {
        const value = e.target.value;
        const volumeIcon = document.getElementById('volumeIcon');
        volumeIcon.className = value > 0 ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        updateGameVolume(value);
    });

    document.getElementById('gameModal').addEventListener('click', e => {
        if (e.target.id === 'gameModal') {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Add keyboard navigation fallback when gamepad is not active
    document.addEventListener('keydown', e => {
        if (!window.gamepadController || !window.gamepadController.isActive) {
            // Handle keyboard navigation here if needed
            if (e.key === 'Tab') {
                // Let default tab behavior work
                return;
            }
        }
    });
});