class GamepadController {
    constructor() {
        this.gamepad = null;
        this.controllerType = 'unknown';
        this.focusedElement = null;
        this.focusableElements = [];
        this.deadzone = 0.3;
        this.repeatDelay = 200;
        this.lastInput = 0;
        this.isActive = false;
        
        // Button mappings for different controller types
        this.buttonMaps = {
            xbox: {
                A: 0, B: 1, X: 2, Y: 3,
                LB: 4, RB: 5, LT: 6, RT: 7,
                SELECT: 8, START: 9, LSTICK: 10, RSTICK: 11,
                UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15
            },
            playstation: {
                CROSS: 0, CIRCLE: 1, SQUARE: 2, TRIANGLE: 3,
                L1: 4, R1: 5, L2: 6, R2: 7,
                SELECT: 8, START: 9, L3: 10, R3: 11,
                UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15
            }
        };
        
        this.init();
    }
    
    init() {
        // Check for gamepad support
        if (!navigator.getGamepads) {
            console.log('Gamepad API not supported');
            return;
        }
        
        // Listen for gamepad events
        window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnected(e));
        
        // Start polling for existing gamepads
        this.pollGamepads();
        this.startGameLoop();
        
        // Initialize focusable elements
        this.updateFocusableElements();
        
        // Listen for DOM changes to update focusable elements
        const observer = new MutationObserver(() => this.updateFocusableElements());
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    onGamepadConnected(event) {
        console.log('Gamepad connected:', event.gamepad.id);
        this.gamepad = event.gamepad;
        this.detectControllerType();
        this.isActive = true;
        this.showGamepadUI();
        this.focusFirstElement();
    }
    
    onGamepadDisconnected(event) {
        console.log('Gamepad disconnected');
        this.gamepad = null;
        this.isActive = false;
        this.hideGamepadUI();
        this.clearFocus();
    }
    
    detectControllerType() {
        if (!this.gamepad) return;
        
        const id = this.gamepad.id.toLowerCase();
        
        if (id.includes('xbox') || id.includes('xinput') || id.includes('microsoft')) {
            this.controllerType = 'xbox';
        } else if (id.includes('playstation') || id.includes('sony') || id.includes('wireless controller')) {
            this.controllerType = 'playstation';
        } else {
            this.controllerType = 'xbox'; // Default to Xbox layout
        }
        
        console.log('Controller type detected:', this.controllerType);
    }
    
    pollGamepads() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && !this.gamepad) {
                this.gamepad = gamepads[i];
                this.detectControllerType();
                this.isActive = true;
                this.showGamepadUI();
                this.focusFirstElement();
                break;
            }
        }
    }
    
    startGameLoop() {
        const gameLoop = () => {
            if (this.isActive && this.gamepad) {
                this.update();
            }
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
    
    update() {
        const gamepads = navigator.getGamepads();
        this.gamepad = gamepads[this.gamepad.index];
        
        if (!this.gamepad) return;
        
        const now = Date.now();
        if (now - this.lastInput < this.repeatDelay) return;
        
        // Handle D-pad and left stick navigation
        const leftStickX = this.gamepad.axes[0];
        const leftStickY = this.gamepad.axes[1];
        
        const buttons = this.buttonMaps[this.controllerType];
        
        // Navigation
        if (this.gamepad.buttons[buttons.UP]?.pressed || leftStickY < -this.deadzone) {
            this.navigateUp();
            this.lastInput = now;
        } else if (this.gamepad.buttons[buttons.DOWN]?.pressed || leftStickY > this.deadzone) {
            this.navigateDown();
            this.lastInput = now;
        } else if (this.gamepad.buttons[buttons.LEFT]?.pressed || leftStickX < -this.deadzone) {
            this.navigateLeft();
            this.lastInput = now;
        } else if (this.gamepad.buttons[buttons.RIGHT]?.pressed || leftStickX > this.deadzone) {
            this.navigateRight();
            this.lastInput = now;
        }
        
        // Action buttons
        if (this.gamepad.buttons[buttons.A || buttons.CROSS]?.pressed) {
            this.pressAction();
            this.lastInput = now;
        } else if (this.gamepad.buttons[buttons.B || buttons.CIRCLE]?.pressed) {
            this.pressBack();
            this.lastInput = now;
        } else if (this.gamepad.buttons[buttons.START]?.pressed) {
            this.pressMenu();
            this.lastInput = now;
        }
    }
    
    updateFocusableElements() {
        const selectors = [
            'button:not([disabled])',
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '.game-card',
            '.app-menu-item',
            '.theme-button',
            '.genre-list a',
            '[tabindex]:not([tabindex="-1"])'
        ];
        
        this.focusableElements = Array.from(document.querySelectorAll(selectors.join(', ')))
            .filter(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
    }
    
    focusFirstElement() {
        this.updateFocusableElements();
        if (this.focusableElements.length > 0) {
            this.setFocus(this.focusableElements[0]);
        }
    }
    
    setFocus(element) {
        if (this.focusedElement) {
            this.focusedElement.classList.remove('gamepad-focused');
        }
        
        this.focusedElement = element;
        if (element) {
            element.classList.add('gamepad-focused');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    clearFocus() {
        if (this.focusedElement) {
            this.focusedElement.classList.remove('gamepad-focused');
            this.focusedElement = null;
        }
    }
    
    getCurrentFocusIndex() {
        return this.focusedElement ? this.focusableElements.indexOf(this.focusedElement) : -1;
    }
    
    navigateUp() {
        this.updateFocusableElements();
        const currentIndex = this.getCurrentFocusIndex();
        
        if (currentIndex > 0) {
            this.setFocus(this.focusableElements[currentIndex - 1]);
        } else if (this.focusableElements.length > 0) {
            this.setFocus(this.focusableElements[this.focusableElements.length - 1]);
        }
    }
    
    navigateDown() {
        this.updateFocusableElements();
        const currentIndex = this.getCurrentFocusIndex();
        
        if (currentIndex < this.focusableElements.length - 1) {
            this.setFocus(this.focusableElements[currentIndex + 1]);
        } else if (this.focusableElements.length > 0) {
            this.setFocus(this.focusableElements[0]);
        }
    }
    
    navigateLeft() {
        // For grid layouts, try to move left within the same row
        this.navigateUp();
    }
    
    navigateRight() {
        // For grid layouts, try to move right within the same row
        this.navigateDown();
    }
    
    pressAction() {
        if (this.focusedElement) {
            if (this.focusedElement.tagName === 'BUTTON') {
                this.focusedElement.click();
            } else if (this.focusedElement.tagName === 'A') {
                this.focusedElement.click();
            } else if (this.focusedElement.classList.contains('game-card')) {
                const playButton = this.focusedElement.querySelector('.play-button');
                if (playButton) {
                    playButton.click();
                }
            }
        }
    }
    
    pressBack() {
        // Handle back navigation
        const modal = document.getElementById('gameModal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        } else {
            const backButton = document.querySelector('#backButton, #backToTitleButton');
            if (backButton && backButton.style.display !== 'none') {
                backButton.click();
            }
        }
    }
    
    pressMenu() {
        const menuButton = document.querySelector('.app-menu-button');
        if (menuButton) {
            menuButton.click();
        }
    }
    
    showGamepadUI() {
        document.body.classList.add('gamepad-active');
        this.showControllerPrompts();
    }
    
    hideGamepadUI() {
        document.body.classList.remove('gamepad-active');
        this.hideControllerPrompts();
    }
    
    showControllerPrompts() {
        const promptsContainer = document.createElement('div');
        promptsContainer.id = 'gamepadPrompts';
        promptsContainer.className = 'gamepad-prompts';
        
        const prompts = this.getControllerPrompts();
        promptsContainer.innerHTML = prompts;
        
        document.body.appendChild(promptsContainer);
    }
    
    hideControllerPrompts() {
        const prompts = document.getElementById('gamepadPrompts');
        if (prompts) {
            prompts.remove();
        }
    }
    
    getControllerPrompts() {
        const buttons = this.controllerType === 'xbox' ? 
            { action: 'A', back: 'B', menu: 'Start' } :
            { action: '✕', back: '○', menu: 'Options' };
            
        return `
            <div class="prompt-item">
                <span class="button-icon ${this.controllerType}">${buttons.action}</span>
                <span class="prompt-text">Select</span>
            </div>
            <div class="prompt-item">
                <span class="button-icon ${this.controllerType}">${buttons.back}</span>
                <span class="prompt-text">Back</span>
            </div>
            <div class="prompt-item">
                <span class="button-icon ${this.controllerType}">${buttons.menu}</span>
                <span class="prompt-text">Menu</span>
            </div>
        `;
    }
}

// Initialize gamepad controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamepadController = new GamepadController();
});