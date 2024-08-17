const canvasSize = 240;
const snakeSize = 10;

function clearRoom(ctx) {
	ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function drawSnake(ctx, bodyPositions) {
	ctx.fillStyle = 'green';
	bodyPositions.forEach((position) => {
		ctx.fillRect(position.x, position.y, snakeSize, snakeSize);
	});
}

function drawFruit(ctx, fruit) {
	ctx.fillStyle = 'red';
	ctx.fillRect(fruit.x, fruit.y, snakeSize, snakeSize);
}

module.exports = {
	clearRoom,
	drawSnake,
	drawFruit,
};