class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.size = 0;
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    this.size++;
    return item;
  }
  dequeue() {
    if (this.size <= 0) return;
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    this.size--;
    return item;
  }
  empty() {
    return this.size === 0;
  }
  peek() {
    return this.items[this.frontIndex];
  }
  get printQueue() {
    return this.items;
  }
}

class Canvas {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = 0.8 * window.innerHeight;
    this.cellSize = 50;
    this.colsCount = Math.floor(this.canvas.width / this.cellSize);
    this.rowsCount = Math.floor(this.canvas.height / this.cellSize);

    this.heroCoords = { x: -1, y: -1 };
    this.obstaclesCoords = [];
    this.enemyCoords = { x: -1, y: -1 };

    this.placeHeroEvent = null;
    this.placeEnemyEvent = null;
    this.placeObstaclesEvent = null;
  }

  updateDimensions() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 0.8 * window.innerHeight;
    this.colsCount = Math.floor(this.canvas.width / this.cellSize);
    this.rowsCount = Math.floor(this.canvas.height / this.cellSize);
  }

  addPlaceHeroEvent = (_) => {
    this.canvas.removeEventListener("click", this.updateEnemyPosition);

    this.canvas.removeEventListener("click", this.addObstacles);

    this.canvas.addEventListener("click", this.updateHeroPosition);
  };

  updateHeroPosition = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (
      x < 0 ||
      x > this.cellSize * this.colsCount ||
      y < 0 ||
      y > this.cellSize * this.rowsCount
    )
      return;
    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    let exists = this.obstaclesCoords.some((c) => c.x === x && c.y === y);
    if (
      (x === this.heroCoords.x && y === this.heroCoords.y) ||
      (x === this.enemyCoords.x && y === this.enemyCoords.y) ||
      exists
    )
      return;
    if (this.heroCoords.x != -1 && this.heroCoords.y != -1) {
      this.ctx.clearRect(
        this.heroCoords.x * this.cellSize,
        this.heroCoords.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
      this.ctx.strokeRect(
        this.heroCoords.x * this.cellSize,
        this.heroCoords.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }
    this.heroCoords.x = x;
    this.heroCoords.y = y;
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      this.heroCoords.x * this.cellSize,
      this.heroCoords.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  };

  addObstacles = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (
      x < 0 ||
      x > this.cellSize * this.colsCount ||
      y < 0 ||
      y > this.cellSize * this.rowsCount
    )
      return;

    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    let exists = this.obstaclesCoords.some((c) => c.x === x && c.y === y);
    if (
      exists ||
      (x === this.heroCoords.x && y === this.heroCoords.y) ||
      (x === this.enemyCoords.x && y === this.enemyCoords.y)
    )
      return;
    this.obstaclesCoords = [...this.obstaclesCoords, { x, y }];
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  };

  addPlaceObstaclesEvent = (_) => {
    this.canvas.removeEventListener("click", this.updateEnemyPosition);

    this.canvas.removeEventListener("click", this.updateHeroPosition);

    this.canvas.addEventListener("click", this.addObstacles);
  };

  updateEnemyPosition = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (
      x < 0 ||
      x > this.cellSize * this.colsCount ||
      y < 0 ||
      y > this.cellSize * this.rowsCount
    )
      return;
    x = Math.floor(x / this.cellSize);
    y = Math.floor(y / this.cellSize);
    let exists = this.obstaclesCoords.some((c) => c.x === x && c.y === y);
    if (
      (x === this.heroCoords.x && y === this.heroCoords.y) ||
      (x === this.enemyCoords.x && y === this.enemyCoords.y) ||
      exists
    )
      return;
    if (this.enemyCoords.x != -1 && this.enemyCoords.y != -1) {
      this.ctx.clearRect(
        this.enemyCoords.x * this.cellSize,
        this.enemyCoords.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
      this.ctx.strokeRect(
        this.enemyCoords.x * this.cellSize,
        this.enemyCoords.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }
    this.enemyCoords.x = x;
    this.enemyCoords.y = y;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.enemyCoords.x * this.cellSize,
      this.enemyCoords.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  };

  addEnemyEvent = (_) => {
    this.canvas.removeEventListener("click", this.addObstacles);

    this.canvas.removeEventListener("click", this.updateHeroPosition);

    this.canvas.addEventListener("click", this.updateEnemyPosition);
  };

  removeEventListener = () => {
    this.canvas.removeEventListener("click", this.addObstacles);

    this.canvas.removeEventListener("click", this.updateHeroPosition);

    this.canvas.removeEventListener("click", this.updateEnemyPosition);
  };
  animate() {
    let visited = Array.from({ length: this.rowsCount }, () =>
      Array.from({ length: this.colsCount }, () => false)
    );

    let q = new Queue();

    q.enqueue({ ...this.heroCoords });
    visited[this.heroCoords.y][this.heroCoords.x] = true;
    // visited[this.enemyCoords.y][this.enemyCoords.x] = true;
    for (let coords of this.obstaclesCoords) {
      visited[coords.y][coords.x] = true;
    }
    let dirs = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
    ];
    this.ctx.fillStyle = "skyblue";
    let found = false;
    while (!q.empty() && !found) {
      let coords = q.peek();
      if (coords.x === this.enemyCoords.x && coords.y === this.enemyCoords.y)
        break;
      q.dequeue();
      for (let dir of dirs) {
        let x = coords.x + dir.dx;
        let y = coords.y + dir.dy;
        if (
          x >= 0 &&
          x < this.colsCount &&
          y >= 0 &&
          y < this.rowsCount &&
          !visited[y][x]
        ) {
          if (x === this.enemyCoords.x && y === this.enemyCoords.y) {
            found = true;
            break;
          }
          visited[y][x] = true;
          q.enqueue({ x, y });
          this.ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          this.ctx.strokeRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      }
    }
  }

  draw() {
    //drawing grid
    for (let i = 0; i < this.rowsCount; i++) {
      for (let j = 0; j < this.colsCount; j++) {
        let y0 = i * this.cellSize;
        let x0 = j * this.cellSize;
        if (this.heroCoords.x === j && this.heroCoords.y === i) {
          this.ctx.fillStyle = "green";
          this.ctx.fillRect(x0, y0, this.cellSize, this.cellSize);
        } else if (this.enemyCoords.x === j && this.enemyCoords.y === i) {
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(x0, y0, this.cellSize, this.cellSize);
        } else {
          this.ctx.strokeRect(x0, y0, this.cellSize, this.cellSize);
        }
      }
    }
    for (let coords of this.obstaclesCoords) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        coords.x * this.cellSize,
        coords.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }
  }
}

class Game {
  constructor() {
    this.canvas = new Canvas(window.innerWidth, window.innerHeight);

    document
      .getElementById("placeHero")
      .addEventListener("click", this.canvas.addPlaceHeroEvent);

    document
      .getElementById("placeObstacles")
      .addEventListener("click", this.canvas.addPlaceObstaclesEvent);

    document
      .getElementById("placeEnemy")
      .addEventListener("click", this.canvas.addEnemyEvent);

    document.getElementById("play").addEventListener("click", this.handlePlay);
  }
  handlePlay = (_) => {
    document
      .getElementById("placeHero")
      .removeEventListener("click", this.canvas.addPlaceHeroEvent);

    document
      .getElementById("placeObstacles")
      .removeEventListener("click", this.canvas.addPlaceObstaclesEvent);

    document
      .getElementById("placeEnemy")
      .removeEventListener("click", this.canvas.addEnemyEvent);

    this.canvas.removeEventListener();

    this.canvas.animate();
  };
  updateDimensions() {
    this.canvas.updateDimensions();
  }
  run() {
    window.addEventListener("resize", () => {
      this.updateDimensions();
    });
    this.canvas.draw();
  }
}

function main() {
  let game = new Game();
  game.run();
}

main();
