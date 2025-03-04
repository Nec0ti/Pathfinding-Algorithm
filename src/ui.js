class UI {
    constructor(grid, runButton, resetButton, algorithmSelector, toggleThemeButton, gridSizeSelector) {
      this.grid = grid;
      this.runButton = runButton;
      this.resetButton = resetButton;
      this.algorithmSelector = algorithmSelector;
      this.toggleThemeButton = toggleThemeButton;
      this.gridSizeSelector = gridSizeSelector;
  
      this.isDrawing = false;
      this.isDarkMode = true; // Initial theme
      this.isErasing = false;
  
      this.attachEventListeners();
    }
  
    attachEventListeners() {
      this.grid.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.isDrawing = true;
          this.drawWall(e);
        } else if (e.button === 2) {
          this.isErasing = true;
          this.eraseWall(e);
        }
      });
  
      this.grid.canvas.addEventListener('mouseup', (e) => {
        this.isDrawing = false;
        this.isErasing = false;
      });
  
      this.grid.canvas.addEventListener('mousemove', (e) => {
        if (this.isDrawing) {
          this.drawWall(e);
        } else if (this.isErasing) {
          this.eraseWall(e);
        }
      });
  
      this.grid.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
  
      this.runButton.addEventListener('click', () => {
        this.runAlgorithm();
      });
  
      this.resetButton.addEventListener('click', () => {
        this.grid.reset();
      });
  
      this.toggleThemeButton.addEventListener('click', () => {
        this.toggleTheme();
      });
  
      this.gridSizeSelector.addEventListener('change', () => {
        const newSize = parseInt(this.gridSizeSelector.value);
        if (!isNaN(newSize)) {
          this.grid.setGridSize(newSize);
        }
      });
    }
  
    drawWall(e) {
      const rect = this.grid.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.grid.gridSize);
      const y = Math.floor((e.clientY - rect.top) / this.grid.gridSize);
      this.grid.addWall(x, y);
    }
  
    eraseWall(e) {
      const rect = this.grid.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.grid.gridSize);
      const y = Math.floor((e.clientY - rect.top) / this.grid.gridSize);
      this.grid.removeWall(x, y);
    }
  
  
    runAlgorithm() {
      const algorithm = this.algorithmSelector.value;
      let pathfinder;
  
      switch (algorithm) {
        case 'astar':
          pathfinder = new AStarPathfinder(this.grid);
          break;
        case 'dijkstra':
          pathfinder = new DijkstraPathfinder(this.grid);
          break;
        case 'bfs':
          pathfinder = new BFSPathfinder(this.grid);
          break;
        default:
          console.error('Unknown algorithm:', algorithm);
          return;
      }
  
      const path = pathfinder.findPath(this.grid.startNode, this.grid.endNode);
  
      if (path) {
        this.grid.drawPath(path);
      } else {
        alert("No path found!");
      }
    }
  
    toggleTheme() {
      document.body.classList.toggle('light-mode');
      this.isDarkMode = !this.isDarkMode;
    }
  }