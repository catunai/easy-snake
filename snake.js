class Snake {
    constructor() {
        this.gridSize = 20;
        this.tileCount = 20;

        this.score = 0;
        this.scoreElement = document.getElementById('scoreValue');
        
        // ADD grid-specific properties
        this.tileCount = 20;
        this.grid = document.getElementById('gameGrid');
        this.score = 0;
        this.scoreElement = document.getElementById('scoreValue');

        this.newGameBtn = document.getElementById('newGameBtn');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.modalNewGameBtn = document.getElementById('modalNewGameBtn');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // Add the event listeners
        this.newGameBtn.addEventListener('click', () => {
            this.resetGame();
            this.newGameBtn.classList.add('hidden');
        });

        this.modalNewGameBtn.addEventListener('click', () => {
            this.gameOverModal.classList.add('hidden');
            this.resetGame();
        });

        // ADD grid cells array and creation
        this.cells = [];
        this.createGrid();

        // Initial snake position and size (moved to center)
        this.snake = [
            { x: 10, y: 10 }
        ];
        
        // Initial direction
        this.dx = 0;
        this.dy = 0;
        
        // Food position
        this.food = this.generateFood();
        
        // Bind keyboard controls
        document.addEventListener('keydown', this.keyDown.bind(this));
        
        // Draw initial state
        this.draw();

        // Set initial game state
        this.isGameActive = true;

        // Start game loop
        setInterval(this.gameLoop.bind(this), 300);
    }

    // ADD new method for grid creation
    createGrid() {
        for (let y = 0; y < this.tileCount; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.tileCount; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                this.grid.appendChild(cell);
                this.cells[y][x] = cell;
            }
        }
    }
    
    // Modified to ensure new food position is different from current
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.tileCount - 2)) + 1,
                y: Math.floor(Math.random() * (this.tileCount - 2)) + 1
            };
        } while (
            this.isPositionOnSnake(newFood) || 
            (this.food && newFood.x === this.food.x && newFood.y === this.food.y)
        );
    
        return newFood;
    }

    isPositionOnSnake(position) {
        return this.snake.some(segment => 
            segment.x === position.x && segment.y === position.y
        );
    }
    
    keyDown(e) {
        // Only handle keys if game is active
        if (!this.isGameActive) return;

        switch(e.key) {
            case 'ArrowUp':
                if (this.dy === 0) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowDown':
                if (this.dy === 0) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.dx === 0) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.dx === 0) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
        }
    }
    
    gameLoop() {
        // Only run game logic if game is active
        if (!this.isGameActive) return;

        // Move snake
        const head = {
            x: this.snake[0].x + this.dx,
            y: this.snake[0].y + this.dy
        };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    draw() {
        // Clear all cells
        for (let y = 0; y < this.tileCount; y++) {
            for (let x = 0; x < this.tileCount; x++) {
                this.cells[y][x].className = 'grid-cell';
            }
        }
        
        // Draw snake
        for (const segment of this.snake) {
            this.cells[segment.y][segment.x].classList.add('snake');
        }
        
        // Draw food
        this.cells[this.food.y][this.food.x].classList.add('food');
    }
    
    gameOver() {
        this.isGameActive = false;
        document.getElementById('gameOverSound').play();
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.classList.remove('hidden');
    }

    resetGame() {
        console.log('Game reset');
        // Clear the entire grid first
        for (let y = 0; y < this.tileCount; y++) {
            for (let x = 0; x < this.tileCount; x++) {
                this.cells[y][x].className = 'grid-cell';
            }
        }

        this.snake = [{ x: 10, y: 10 }]; // Keep consistent with initial position
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.food = this.generateFood();
        this.isGameActive = true;
        this.draw();
    }
}

// Start the game when the page loads
window.onload = () => {
    new Snake();
};
