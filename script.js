class FruitSliceGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.isPlaying = false;
        this.fruits = [
            'https://cdn-icons-png.flaticon.com/128/415/415733.png',
            'https://cdn-icons-png.flaticon.com/128/1135/1135995.png',
            'https://cdn-icons-png.flaticon.com/128/1135/1135532.png',
            'https://cdn-icons-png.flaticon.com/128/1135/1135541.png'
        ];
        this.initElements();
        this.bindEvents();
        this.slicePositions = [];
    }

    initElements() {
        this.scoreElement = document.getElementById('scoreValue');
        this.livesContainer = document.getElementById('livesContainer');
        this.gameArea = document.getElementById('gameArea');
        this.fruitContainer = document.getElementById('fruitContainer');
        this.startButton = document.getElementById('startButton');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.restartButton = document.getElementById('restartButton');
        this.sliceSound = document.getElementById('sliceSound');
        this.finalScoreElement = document.getElementById('finalScore');
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        this.fruitContainer.addEventListener('mousemove', this.trackSlicePosition.bind(this));
        this.fruitContainer.addEventListener('touchmove', this.trackSlicePosition.bind(this));
        
        this.fruitContainer.addEventListener('mouseenter', this.resetSlicePositions.bind(this));
        this.fruitContainer.addEventListener('touchstart', this.resetSlicePositions.bind(this));
    }

    resetSlicePositions() {
        this.slicePositions = [];
    }

    trackSlicePosition(event) {
        if (!this.isPlaying) return;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        this.slicePositions.push({ x: clientX, y: clientY });

        if (this.slicePositions.length > 5) {
            this.slicePositions.shift();
        }

        this.checkFruitSlice();
    }

    checkFruitSlice() {
        const fruits = document.querySelectorAll('.fruit');
        fruits.forEach(fruit => {
            const rect = fruit.getBoundingClientRect();
            
            const isSliced = this.slicePositions.some(pos => 
                pos.x >= rect.left && pos.x <= rect.right && 
                pos.y >= rect.top && pos.y <= rect.bottom
            );

            if (isSliced) {
                this.sliceFruit(fruit);
            }
        });
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.lives = 3;
        this.scoreElement.textContent = this.score;
        this.startButton.style.display = 'none';
        this.updateLives();
        this.dropFruit();
    }

    dropFruit() {
        const fruit = document.createElement('img');
        fruit.src = this.fruits[Math.floor(Math.random() * this.fruits.length)];
        fruit.classList.add('fruit');
        
        const startX = Math.random() * (this.fruitContainer.clientWidth - 80);
        fruit.style.left = `${startX}px`;
        fruit.style.top = '-80px';
        
        this.fruitContainer.appendChild(fruit);

        gsap.to(fruit, {
            duration: 3,
            y: this.fruitContainer.clientHeight,
            ease: 'linear',
            onComplete: () => this.missedFruit(fruit)
        });
    }

    sliceFruit(fruit) {
        if (fruit.dataset.sliced) return;
        
        fruit.dataset.sliced = 'true';
        this.sliceSound.play();
        this.score += 10;
        this.scoreElement.textContent = this.score;
        
        gsap.to(fruit, {
            duration: 0.3,
            scale: 0,
            opacity: 0,
            onComplete: () => {
                fruit.remove();
                this.dropFruit();
            }
        });
    }

    missedFruit(fruit) {
        if (fruit.parentNode) {
            fruit.remove();
            this.lives--;
            this.updateLives();

            if (this.lives === 0) {
                this.gameOver();
            } else {
                this.dropFruit();
            }
        }
    }

    updateLives() {
        this.livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const lifeElement = document.createElement('div');
            lifeElement.classList.add('life');
            this.livesContainer.appendChild(lifeElement);
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.gameOverlay.style.display = 'flex';
        this.finalScoreElement.textContent = `Your Score: ${this.score}`;
    }

    restartGame() {
        this.gameOverlay.style.display = 'none';
        this.fruitContainer.innerHTML = '';
        this.startButton.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FruitSliceGame();
});