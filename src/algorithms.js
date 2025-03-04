class Pathfinder {
    constructor(grid) {
        if (this.constructor === Pathfinder) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.grid = grid;
    }

    findPath(start, end) {
        throw new Error("Method 'findPath()' must be implemented.");
    }
}


class AStarPathfinder extends Pathfinder {
  constructor(grid) {
    super(grid);
  }

  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  findPath(start, end) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    gScore[this.getKey(start)] = 0;
    fScore[this.getKey(start)] = this.heuristic(start, end);

    while (openSet.length > 0) {
      const current = openSet.reduce((minNode, node) =>
        fScore[this.getKey(node)] < fScore[this.getKey(minNode)] ? node : minNode
      );

      if (current.x === end.x && current.y === end.y) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(openSet.indexOf(current), 1);

      const neighbors = this.getNeighbors(current);

      for (const neighbor of neighbors) {
        const tentativeGScore = gScore[this.getKey(current)] + 1;

        if (
          !gScore.hasOwnProperty(this.getKey(neighbor)) ||
          tentativeGScore < gScore[this.getKey(neighbor)]
        ) {
          cameFrom[this.getKey(neighbor)] = current;
          gScore[this.getKey(neighbor)] = tentativeGScore;
          fScore[this.getKey(neighbor)] = tentativeGScore + this.heuristic(neighbor, end);

          if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return null; // No path found
  }

  getNeighbors(node) {
    const { x, y } = node;
    const neighbors = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ];

    return neighbors.filter(neighbor => this.grid.isValid(neighbor.x, neighbor.y));
  }

  reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[this.getKey(current)]) {
      current = cameFrom[this.getKey(current)];
      path.unshift(current);
    }
    return path;
  }

    getKey(node) {
        return node.x + ',' + node.y;
    }

}

class DijkstraPathfinder extends Pathfinder {
    constructor(grid) {
        super(grid);
    }

    findPath(start, end) {
        const distances = {};
        const visited = {};
        const previous = {};
        const queue = [];

        distances[this.getKey(start)] = 0;
        queue.push(start);

        while (queue.length > 0) {
            queue.sort((a, b) => distances[this.getKey(a)] - distances[this.getKey(b)]);
            const current = queue.shift();

            if (visited[this.getKey(current)]) continue;
            visited[this.getKey(current)] = true;

            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(previous, current);
            }

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const distance = distances[this.getKey(current)] + 1; // Distance to neighbor

                if (!distances[this.getKey(neighbor)] || distance < distances[this.getKey(neighbor)]) {
                    distances[this.getKey(neighbor)] = distance;
                    previous[this.getKey(neighbor)] = current;
                    queue.push(neighbor);
                }
            }
        }

        return null; // No path found
    }

    getNeighbors(node) {
        const { x, y } = node;
        const neighbors = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 }
        ];

        return neighbors.filter(neighbor => this.grid.isValid(neighbor.x, neighbor.y));
    }

    reconstructPath(previous, current) {
        const path = [current];
        while (previous[this.getKey(current)]) {
            current = previous[this.getKey(current)];
            path.unshift(current);
        }
        return path;
    }

    getKey(node) {
        return node.x + ',' + node.y;
    }
}

class BFSPathfinder extends Pathfinder {
    constructor(grid) {
        super(grid);
    }

    findPath(start, end) {
        const queue = [start];
        const visited = {};
        const previous = {};

        visited[this.getKey(start)] = true;

        while (queue.length > 0) {
            const current = queue.shift();

            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(previous, current);
            }

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!visited[this.getKey(neighbor)]) {
                    visited[this.getKey(neighbor)] = true;
                    previous[this.getKey(neighbor)] = current;
                    queue.push(neighbor);
                }
            }
        }

        return null; // No path found
    }

    getNeighbors(node) {
        const { x, y } = node;
        const neighbors = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 }
        ];

        return neighbors.filter(neighbor => this.grid.isValid(neighbor.x, neighbor.y));
    }

    reconstructPath(previous, current) {
        const path = [current];
        while (previous[this.getKey(current)]) {
            current = previous[this.getKey(current)];
            path.unshift(current);
        }
        return path;
    }

    getKey(node) {
        return node.x + ',' + node.y;
    }
}