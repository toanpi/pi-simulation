// Game rules:
// 1. The snake moves in a straight line until it hits a wall or itself
// 2. The snake grows longer each time it eats a piece of fruit
// 3. The game is over when the snake hits a wall or itself
// 4. The game is won when the snake eats all the fruit
const GAME = {
  INIT: 'INITIALIZING',
  READY: 'GAME_READY',
  SETUP: 'GAME_SETUP',
  PLAYING: 'GAME_PLAYING',
  OVER: 'GAME_OVER',
}

let state = GAME.INIT;

function initGame() {
  state = GAME.READY;
  return state;
}

function startGame() {
  state = GAME.PLAYING;
  return state;
}

function endGame() {
  state = GAME.OVER;
  return state;
}

function getGameState() {
  return state;
}

function checkRules(x, y, canvasSize, snakeSize) {
	// if next values break bounds of canvas, make game over
  if (
    x >= canvasSize || x <= 0 - snakeSize || 
    y >= canvasSize || y <= 0 - snakeSize
  ) {
    return false;
  }

  return true;
}



export { getGameState, GAME, initGame, startGame, endGame, checkRules };
