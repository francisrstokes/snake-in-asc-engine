const {vAdd, vDist} = require('vec-la-fp');
const {darkenHex} = require('kandinsky-js');

const {LAYERS} = require('asc-engine/src/constants');
const {posFromGridIndex} = require('asc-engine/src/util');
const Game = require('asc-engine/src/Game');
const Area = require('asc-engine/src/Area');
const Tile = require('asc-engine/src/Tile');

const vEqual = ([x, y], [x2, y2]) => x === x2 && y === y2;

const game = new Game('main', 1000, 700);
const toGameArea = game.createScreenRegion([12*20, 2*20], () => game.area.size);
const toTitleArea = game.createScreenRegion([0, 0], () => game.area.size);
const toScoreArea = game.createScreenRegion([40*20, 0], () => game.area.size);

const snake = {
  tile: new Tile('@', '#ff0000', LAYERS.FG),
  body: [[13, 17]],
  dir: [0, -1],
  getHead: () => snake.body[0],
  reset: () => snake.body = [[13, 17]]
};

let food = {
  tile: new Tile('*', '#0f0'),
  pos: [1 + Math.floor(Math.random() * 24), 1 + Math.floor(Math.random() * 31)],
  next: () => food.pos = [1 + Math.floor(Math.random() * 24), 1 + Math.floor(Math.random() * 31)]
}

const title = new Tile('S . N . A . K . E', '#f11', LAYERS.HUD);
const scoreTile = new Tile('Score: 0', '#0f0', LAYERS.HUD);

let score = 0;

const speed = 5;
const FRAME_TIME = 16.6;
let lastTime = Date.now();
let currentTime = lastTime;

const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

game.onUpdate = function () {
  if (game.input.keyIsDown('ArrowUp') && !vEqual(snake.dir, DOWN)) {
    snake.dir = UP;
  } else if (game.input.keyIsDown('ArrowDown') && !vEqual(snake.dir, UP)) {
    snake.dir = DOWN;
  } else if (game.input.keyIsDown('ArrowLeft') && !vEqual(snake.dir, RIGHT)) {
    snake.dir = LEFT;
  } else if (game.input.keyIsDown('ArrowRight') && !vEqual(snake.dir, LEFT)) {
    snake.dir = RIGHT;
  }

  currentTime = Date.now();
  if (currentTime - lastTime >= FRAME_TIME * speed) {
    lastTime = currentTime;

    let head = snake.getHead();
    let targetPos = vAdd(head, snake.dir);
    const targetTile = game.getTile(targetPos);

    const hit = targetTile.properties.includes('SOLID') || snake.body.slice(1).some(p => vEqual(targetPos, p));

    if (!hit) {
      for(let i = 0; i < snake.body.length; i++) {
        let oldPos = snake.body[i];
        snake.body[i] = targetPos;
        targetPos = oldPos;
      }
      head = snake.getHead();
      if (vEqual(head, food.pos)) {
        food.next();
        snake.body.push(head);
        score += 10;
        scoreTile.char = `Score: ${score}`;
      }
    } else {
      snake.reset();
      score = 0;
      scoreTile.char = 'Score: 0';
    }
  }
};

game.onDraw = function () {
  this.renderer.clearBackground('#000');
  this.renderer.setTileSize(this.area.size);

  this.area.grid.forEach((t, i) => {
    const pos = toGameArea(
      posFromGridIndex(i, this.area.width, this.area.height)
    );
    this.renderer.drawTile(t, pos);
  });

  snake.body.forEach((p, i) => {
    const pc = Math.max(0, (i / snake.body.length) - 0.2);
    const tile = {...snake.tile};
    tile.color = darkenHex(pc, tile.color);
    game.renderer.drawTile(tile, toGameArea(p))
  });
  game.renderer.drawTile(food.tile, toGameArea(food.pos));

  game.renderer.drawTile(title, toTitleArea([1, 1]));
  game.renderer.drawTile(scoreTile, toScoreArea([0, 1]));
}

const renderEffects = () => {
  const pos = toGameArea(snake.getHead());
  const s = Math.ceil(snake.body.length**0.5);
  game.renderer.buffers[LAYERS.BG].forEach(cell => {
    if (vDist(cell.pos, pos) > s * game.area.size) {
      cell.color = darkenHex(
        cell.char === '.' ? 0.75 : 0.35,
        cell.color
      );
    }
  })
};

const S = Tile.from('#', '#999999');
S.addProperty('SOLID');
const F = Tile.from('.', '#aaaaaa');
const tiles = [
  S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,S,
  S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,
];

const gameArea = new Area(26, 33, [0, 0], 20);

gameArea.setGrid(tiles);
game.setCurrentArea(gameArea);
game.start();



game.subscribe('@@FRAME_BEFORE_RENDER_COMMIT', renderEffects);
