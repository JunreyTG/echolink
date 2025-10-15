import React, { useState, useRef, useEffect, useCallback } from 'react';

// Game constants
const CANVAS_SIZE = 400;
const SCALE = 20; // Size of each grid cell
const INITIAL_SNAKE = [[8, 8], [8, 7]];
const INITIAL_FOOD = [5, 5];
const SPEED = 150; // Milliseconds
const DIRECTIONS: { [key: string]: number[] } = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState<number[]>(DIRECTIONS.ArrowRight);
  const [speed, setSpeed] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  const createFood = () =>
    food.map((_, i) => Math.floor(Math.random() * (CANVAS_SIZE / SCALE)));

  const checkCollision = (head: number[], sn: number[][] = snake) => {
    if (
      head[0] * SCALE >= CANVAS_SIZE ||
      head[0] < 0 ||
      head[1] * SCALE >= CANVAS_SIZE ||
      head[1] < 0
    )
      return true;
    for (const segment of sn) {
      if (head[0] === segment[0] && head[1] === segment[1]) return true;
    }
    return false;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newDirection = DIRECTIONS[e.key];
    // Prevent the snake from reversing
    if (newDirection && (direction[0] !== -newDirection[0] && direction[1] !== -newDirection[1])) {
      setDirection(newDirection);
    }
  };

  const gameLoop = useCallback(() => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + direction[0], snakeCopy[0][1] + direction[1]];

    if (checkCollision(newSnakeHead)) {
      setSpeed(null);
      setGameOver(true);
      return;
    }
    
    snakeCopy.unshift(newSnakeHead);

    if (newSnakeHead[0] === food[0] && newSnakeHead[1] === food[1]) {
        setScore(prev => prev + 1);
        setFood(createFood());
    } else {
        snakeCopy.pop();
    }
    
    setSnake(snakeCopy);
  }, [snake, direction, food]);


  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        context.fillStyle = "rgb(74 222 128)"; // green-400
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "rgb(239 68 68)"; // red-500
        context.fillRect(food[0], food[1], 1, 1);
    }
  }, [snake, food, gameOver]);
  
  useEffect(() => {
    if (speed !== null) {
      const interval = setInterval(gameLoop, speed);
      return () => clearInterval(interval);
    }
  }, [speed, gameLoop]);


  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="relative focus:outline-none">
      <canvas
        ref={canvasRef}
        width={`${CANVAS_SIZE}px`}
        height={`${CANVAS_SIZE}px`}
        className="bg-gray-900 rounded-md border-2 border-gray-700 mx-auto"
      />
      <div className="flex justify-between items-center mt-2 px-2">
        <p className="text-white font-semibold">Score: {score}</p>
        <p className="text-gray-400 text-sm">Use Arrow Keys to Move</p>
      </div>
       {(gameOver || speed === null) && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-md">
            {gameOver && <h3 className="text-3xl font-bold text-white mb-2">Game Over</h3>}
            <button onClick={startGame} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                {gameOver ? 'Play Again' : 'Start Game'}
            </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;