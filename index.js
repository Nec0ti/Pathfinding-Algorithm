const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const rows = canvas.width / gridSize;
    const cols = canvas.height / gridSize;

    let startNode = { x: 1, y: 1 };
    let endNode = { x: rows - 2, y: cols - 2 };
    let walls = [];

    function heuristic(a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function aStar() {
      const openSet = [startNode];
      const cameFrom = {};

      const gScore = {};
      gScore[startNode.x + startNode.y * rows] = 0;

      const fScore = {};
      fScore[startNode.x + startNode.y * rows] = heuristic(startNode, endNode);

      while (openSet.length > 0) {
        // Find the node with the lowest fScore in openSet
        let current = openSet.reduce((minNode, node) =>
          fScore[node.x + node.y * rows] < fScore[minNode.x + minNode.y * rows] ? node : minNode
        );

        if (current.x === endNode.x && current.y === endNode.y) {
          // Reconstruct the path
          const path = [];
          while (cameFrom[current.x + current.y * rows]) {
            path.unshift(current);
            current = cameFrom[current.x + current.y * rows];
          }
          path.unshift(startNode);
          drawPath(path);
          return;
        }

        openSet.splice(openSet.indexOf(current), 1);

        const neighbors = [
          { x: current.x - 1, y: current.y },
          { x: current.x + 1, y: current.y },
          { x: current.x, y: current.y - 1 },
          { x: current.x, y: current.y + 1 }
        ];

        for (const neighbor of neighbors) {
          if (
            neighbor.x >= 0 && neighbor.x < rows &&
            neighbor.y >= 0 && neighbor.y < cols &&
            !walls.some(wall => wall.x === neighbor.x && wall.y === neighbor.y)
          ) {
            const tentativeGScore = gScore[current.x + current.y * rows] + 1;

            if (
              !gScore.hasOwnProperty(neighbor.x + neighbor.y * rows) ||
              tentativeGScore < gScore[neighbor.x + neighbor.y * rows]
            ) {
              cameFrom[neighbor.x + neighbor.y * rows] = current;
              gScore[neighbor.x + neighbor.y * rows] = tentativeGScore;
              fScore[neighbor.x + neighbor.y * rows] = tentativeGScore + heuristic(neighbor, endNode);

              if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
              }
            }
          }
        }
      }
    }

    function drawPath(path) {
      ctx.strokeStyle = 'blue'; 
      ctx.lineWidth = 3;

      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        ctx.beginPath();
        ctx.moveTo(current.x * gridSize + gridSize / 2, current.y * gridSize + gridSize / 2);
        ctx.lineTo(next.x * gridSize + gridSize / 2, next.y * gridSize + gridSize / 2);
        ctx.stroke();
      }
    }

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
      }

      // Draw start node
      ctx.fillStyle = 'green';
      ctx.fillRect(startNode.x * gridSize, startNode.y * gridSize, gridSize, gridSize);

      // Draw end node
      ctx.fillStyle = 'red';
      ctx.fillRect(endNode.x * gridSize, endNode.y * gridSize, gridSize, gridSize);

      // Draw walls
      ctx.fillStyle = 'black';
      for (const wall of walls) {
        ctx.fillRect(wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / gridSize);
        const y = Math.floor((e.clientY - rect.top) / gridSize);

        // Add walls
        if (!walls.some(wall => wall.x === x && wall.y === y)) {
          walls.push({ x, y });
          drawGrid();
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      aStar();
    });

    drawGrid();