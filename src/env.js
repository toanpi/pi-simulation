
function generateFruitCoords(bodyPositions, canvasSize) {
  const x = Math.floor(Math.random() * (canvasSize / 10)) * 10;
  const y = Math.floor(Math.random() * (canvasSize / 10)) * 10;
  
  const conflictsWithSnake = bodyPositions.find(part => (part.x === x && part.y === y));
  if (!!conflictsWithSnake) {
    return generateFruitCoords(bodyPositions, canvasSize);
  }
  return { x, y };
}

export { generateFruitCoords };
