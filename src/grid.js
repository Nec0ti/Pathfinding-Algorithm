class Grid {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = gridSize;
        this.rows = Math.floor(canvas.width / gridSize);
        this.cols = Math.floor(canvas.height / gridSize);
        this.startNode = { x: 1, y: 1 };
        this.endNode = { x: this.rows - 2, y: this.cols - 2 };
        this.walls = [];
    }

    reset() {
        this.walls = [];
        this.startNode = { x: 1, y: 1 };
        this.endNode = { x: this.rows - 2, y: this.cols - 2 };
        this.draw();
    }

    setGridSize(newSize) {
        this.gridSize = newSize;
        this.rows = Math.floor(this.canvas.width / newSize);
        this.cols = Math.floor(this.canvas.height / newSize);
        this.reset();
    }

    isWall(x, y) {
        return this.walls.some(wall => wall.x === x && wall.y === y);
    }

    isValid(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols && !this.isWall(x, y);
    }

    addWall(x, y) {
        if (!this.walls.some(wall => wall.x === x && wall.y === y) &&
            !(x === this.startNode.x && y === this.startNode.y) &&
            !(x === this.endNode.x && y === this.endNode.y)) {
            this.walls.push({ x, y });
            this.draw();
        }
    }

    removeWall(x, y) {
        this.walls = this.walls.filter(wall => !(wall.x === x && wall.y === y));
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'var(--grid-color)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.ctx.strokeRect(i * this.gridSize, j * this.gridSize, this.gridSize, this.gridSize);
            }
        }

        this.ctx.fillStyle = 'var(--wall-color)';
        for (const wall of this.walls) {
            this.ctx.fillRect(wall.x * this.gridSize, wall.y * this.gridSize, this.gridSize, this.gridSize);
        }

        this.ctx.fillStyle = 'var(--start-color)';
        this.ctx.fillRect(this.startNode.x * this.gridSize, this.startNode.y * this.gridSize, this.gridSize, this.gridSize);

        this.ctx.fillStyle = 'var(--end-color)';
        this.ctx.fillRect(this.endNode.x * this.gridSize, this.endNode.y * this.gridSize, this.gridSize, this.gridSize);
    }

    drawPath(path) {
        this.ctx.strokeStyle = 'var(--path-color)';
        this.ctx.lineWidth = 3;

        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i];
            const next = path[i + 1];
            this.ctx.beginPath();
            this.ctx.moveTo(current.x * this.gridSize + this.gridSize / 2, current.y * this.gridSize + this.gridSize / 2);
            this.ctx.lineTo(next.x * this.gridSize + this.gridSize / 2, next.y * this.gridSize + this.gridSize / 2);
            this.ctx.stroke();
        }
    }
}