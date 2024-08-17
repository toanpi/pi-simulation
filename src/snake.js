const DIRECTION = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
}

function calculatePosition(bodyPositions, direction, cellSize) {
		// calculate next position for element
		const newBodyPositions = bodyPositions.map(({ x, y }, i) => {
			const isHead = i === 0;
			let nextX;
			let nextY;
			
			switch(direction) {
				case DIRECTION.RIGHT:
						nextX = isHead ? x + cellSize : bodyPositions[i - 1].x;
						nextY = isHead ? y : bodyPositions[i - 1].y;
						break;
				case DIRECTION.LEFT:
						nextX = isHead ? x - cellSize : bodyPositions[i - 1].x;
						nextY = isHead ? y : bodyPositions[i - 1].y;
						break;
				case DIRECTION.DOWN:
						nextX = isHead ? x : bodyPositions[i - 1].x;
						nextY = isHead ? y + cellSize : bodyPositions[i - 1].y;
						break;
				case DIRECTION.UP:
				default:
						nextX = isHead ? x : bodyPositions[i - 1].x;
						nextY = isHead ? y - cellSize : bodyPositions[i - 1].y;
						break;
		}
		return {
			x: nextX,
			y: nextY,
			}
		});

    return newBodyPositions;
}

function changeDirection(nextDirection) {
  let direction = DIRECTION.RIGHT;

  switch(nextDirection) {
    case DIRECTION.LEFT:
      if (direction !== DIRECTION.RIGHT) {
        direction = nextDirection;
      }
      break;
    case DIRECTION.RIGHT:
      if (direction !== DIRECTION.LEFT) {
        direction = nextDirection;
      }
      break;
    case DIRECTION.UP:
      if (direction !== DIRECTION.DOWN) {
        direction = nextDirection;
      }
      break;
    case DIRECTION.DOWN:
      if (direction !== DIRECTION.UP) {
        direction = nextDirection;
      }
      break;
  }

  return direction;
}


module.exports = {
  calculatePosition,
  changeDirection,
}