<script>
	import { onMount, onDestroy } from 'svelte';
	import {calculatePosition, changeDirection} from './snake';
	import { generateFruitCoords } from './env';

	onMount(() => {
		reset();
		document.addEventListener('keydown', listenForKeyboard);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', listenForKeyboard);
	});
	const canvasSize = 240;
	const snakeSize = 10;
	const GAME = {
		INIT: 'INITIALIZING',
		READY: 'GAME_READY',
		SETUP: 'GAME_SETUP',
		PLAYING: 'GAME_PLAYING',
		OVER: 'GAME_OVER',
	}
	const DIRECTION = {
		RIGHT: 'RIGHT',
		LEFT: 'LEFT',
		UP: 'UP',
		DOWN: 'DOWN',
	}
	const keys = {
		'arrowup': DIRECTION.UP,
		'arrowright': DIRECTION.RIGHT,
		'arrowdown': DIRECTION.DOWN,
		'arrowleft': DIRECTION.LEFT,
		'w': DIRECTION.UP,
		'a': DIRECTION.LEFT,
		's': DIRECTION.DOWN,
		'd': DIRECTION.RIGHT,
	}

	const acceptableKeys = Object.keys(keys);
	function listenForKeyboard(e) {
		const key = e.key.toLowerCase()
		if (acceptableKeys.includes(key)) {
			direction = changeDirection(keys[key]);
		}
	}
	
	let gameState = GAME.INIT;
	let canvas;
	let ctx;
	let speedMs;
	let direction; 
	let bodyPositions = [];
	let fruit;
	$: score = (bodyPositions.length - 4) * 10;
	$: highScore = score > highScore ? score : highScore || 0;
	$: {
		if (highScore !== 0) {
			localStorage.setItem('snakeHighScore', highScore);
		}
	}
	onMount(() => {
		const hs = localStorage.getItem('snakeHighScore');
		if (hs) {
			highScore = hs;
		}
	});
	
	function reset() {
		if (ctx) {
			ctx.clearRect(0,0,canvasSize, canvasSize);
		}
		speedMs = 200;
		direction = DIRECTION.RIGHT; 
		bodyPositions = [
				{ x: 50, y: 50 }, 
				{ x: 40, y: 50 },
				{ x: 30, y: 50 },
		];
		gameState = GAME.READY;
		fruit = undefined;
	}

	function setupGame() {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		gameState = GAME.PLAYING;
		drawSnake();
	}

	function drawSnake() {
		
		bodyPositions = calculatePosition(bodyPositions, direction, snakeSize);

		bodyPositions.forEach(({ x, y }, i) => {
			const isHead = i === 0;
			// if next values break bounds of canvas, make game over
		
			if (
					x >= canvasSize || 
					x <= 0 - snakeSize || 
					y >= canvasSize || 
					y <= 0 - snakeSize
			) {
				console.log("Game over")
				gameState = GAME.OVER;
			}
			
			// if head touches fruit; remove it and add new body part
			if (isHead && fruit && x === fruit.x && y === fruit.y) {
					fruit = undefined;
			}
		});

		
		if (!fruit) {
			const currentTail = bodyPositions[bodyPositions.length - 1];
			bodyPositions = [...bodyPositions, { ...currentTail }];
			speedMs *= .95;
		}
		// if no fruit; create it!
		createAndDrawFruit();
		
		ctx.fillStyle = 'green';
		bodyPositions.forEach(({ x, y }) => {
			ctx.fillRect(x, y, snakeSize, snakeSize);
		});
		
		// recursivley call, but check if boundaries are reached and end game
		setTimeout(() => {
			if (gameState !== GAME.OVER) {
				// reset canvas then draw
				ctx.clearRect(0,0,canvasSize, canvasSize);
				drawSnake();	
			}
		}, speedMs);
	}

	function createAndDrawFruit() {
		if (!fruit) {
			fruit = generateFruitCoords(bodyPositions, canvasSize);
		}
		ctx.fillStyle = 'red';
		ctx.fillRect(fruit.x, fruit.y, snakeSize, snakeSize);
	}

</script>
<main class="main">
	<header>
			<div>
				Score: {bodyPositions.length !== 3 ? score : '0'}
			</div>
			<div>
				High score: {highScore}
			</div>
	</header>
	<div class="canvasContainer">
		<canvas id="canvas" width={canvasSize} height={canvasSize}></canvas>
		{#if gameState === GAME.OVER || gameState === GAME.READY}
			<div class="gameDialog">
				{#if gameState === GAME.READY}
					SNAKE
				{:else}
					GAME OVER	
				{/if}
				<button on:click={() => {
					reset(); 
					setupGame();
					}}>
					{#if gameState === GAME.READY}
						Play
					{:else}
						Restart
					{/if}
				</button>
			</div>
		{/if}
	</div>

</main>
<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 240px;
		margin: 0 auto;
	}
	header {
		width: 100%;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	#canvas {
		border: 1px solid #000;
	}
	.canvasContainer {
		position: relative;
	}
	.gameDialog {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255,255,255,.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gameDialog button {
		margin: 8px 0;
	}
</style>