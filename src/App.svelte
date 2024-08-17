<script>
	import { onMount, onDestroy } from 'svelte';
	import {calculatePosition, changeDirection} from './snake';
	import { generateFruitCoords } from './env';
	import { clearRoom, drawSnake, drawFruit } from './graph';
	import { initGame, GAME, startGame, endGame, checkRules } from './game';
	
	onMount(() => {
		reset();
		document.addEventListener('keydown', listenForKeyboard);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', listenForKeyboard);
	});

	const canvasSize = 240;
	const snakeSize = 10;
	
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
			direction = changeDirection(keys[key], direction);
		}
	}
	
	let gameState = GAME.INIT;
	let canvas;
	let ctx;
	let speedMs;
	let direction; 
	let bodyPositions = [];
	let fruit;
	
	function reset() {
		if (ctx) {
			clearRoom(ctx);
		}

		speedMs = 200;
		direction = DIRECTION.RIGHT; 
		bodyPositions = [
				{ x: 50, y: 50 }, 
				{ x: 40, y: 50 },
				{ x: 30, y: 50 },
		];
		gameState = initGame();
		fruit = undefined;
	}

	function setupGame() {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		gameState = startGame();
		snakeMove();
	}

	function snakeMove() {
		bodyPositions = calculatePosition(bodyPositions, direction, snakeSize);

		console.log(bodyPositions);

		bodyPositions.forEach(({ x, y }, i) => {
			const isHead = i === 0;
			
			if (!checkRules(x, y, canvasSize, snakeSize)) {
				gameState = endGame();
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

			fruit = generateFruitCoords(bodyPositions, canvasSize);
		}

		drawFruit(ctx, fruit);
		drawSnake(ctx, bodyPositions);

		// recursivley call, but check if boundaries are reached and end game
		setTimeout(() => {
			if (gameState !== GAME.OVER) {
				clearRoom(ctx);
				snakeMove();	
			}
		}, speedMs);
	}

</script>
<main class="main">
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