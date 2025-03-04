document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('grid-canvas');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');
    const algorithmSelector = document.getElementById('algorithm-selector');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const gridSizeSelector = document.getElementById('grid-size-selector');

    let gridSize = parseInt(gridSizeSelector.value);

    const grid = new Grid(canvas, gridSize);
    grid.draw();

    const ui = new UI(grid, runButton, resetButton, algorithmSelector, toggleThemeButton, gridSizeSelector);
});