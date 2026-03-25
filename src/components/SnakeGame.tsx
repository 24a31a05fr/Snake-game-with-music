import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Skull, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
];
const INITIAL_DIRECTION = 'UP';

const DIFFICULTIES = {
  EASY: 200,
  MEDIUM: 120,
  HARD: 70,
};

type DifficultyKey = keyof typeof DIFFICULTIES;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<DifficultyKey>('MEDIUM');

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, DIFFICULTIES[difficulty]);
    return () => clearInterval(interval);
  }, [moveSnake, difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col w-full max-w-[400px] gap-2">
        <div className="flex justify-between px-4 items-center font-pixel">
          <div className="text-cyan text-3xl cyan-text tracking-tighter">
            SCORE: {score}
          </div>
          <div className="text-magenta text-3xl magenta-text tracking-tighter">
            {isGameOver ? 'HALT' : isPaused ? 'IDLE' : 'RUN'}
          </div>
        </div>
        <div className="flex justify-center px-4 items-center font-pixel">
          <div className="text-cyan/60 text-xl cyan-text tracking-tighter opacity-70">
            HIGH_SCORE: {highScore}
          </div>
        </div>
      </div>

      <div className="relative glitch-border p-1 bg-dark">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="shadow-2xl"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/90 backdrop-blur-sm p-4">
            {isGameOver ? (
              <>
                <Skull className="text-magenta mb-4 animate-bounce" size={60} />
                <h2 className="text-magenta font-display text-xl mb-4 magenta-text text-center">CORE_DUMPED</h2>
                
                <div className="flex flex-col gap-4 w-full max-w-[240px] mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-magenta font-pixel text-sm text-center uppercase tracking-widest">Select Difficulty</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`py-1 px-2 font-pixel text-xs border transition-all ${
                            difficulty === level 
                              ? 'bg-cyan text-dark border-cyan shadow-[0_0_10px_#00ffff]' 
                              : 'bg-dark text-cyan border-cyan/30 hover:border-cyan'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-[200px]">
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-magenta text-dark font-pixel font-bold text-lg hover:bg-cyan transition-colors glitch-border"
                  >
                    REBOOT
                  </button>
                </div>
              </>
            ) : (
              <>
                <Pause className="text-cyan mb-4 animate-pulse" size={60} />
                <h2 className="text-cyan font-display text-xl mb-4 cyan-text text-center">WAIT_STATE</h2>
                
                <div className="flex flex-col gap-4 w-full max-w-[240px] mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-magenta font-pixel text-sm text-center uppercase tracking-widest">Select Difficulty</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`py-1 px-2 font-pixel text-xs border transition-all ${
                            difficulty === level 
                              ? 'bg-cyan text-dark border-cyan shadow-[0_0_10px_#00ffff]' 
                              : 'bg-dark text-cyan border-cyan/30 hover:border-cyan'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-cyan text-dark font-pixel font-bold text-xl hover:bg-magenta transition-colors glitch-border w-full max-w-[200px]"
                >
                  RESUME
                </button>
                <p className="mt-4 text-sm text-magenta font-pixel animate-pulse">PRESS_SPACE_TO_INTERRUPT</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm font-pixel text-cyan/60 uppercase tracking-widest">
        <div className="flex flex-col items-center border border-cyan/20 p-2">
          <span className="text-magenta">INPUT</span>
          <span>ARROWS</span>
        </div>
        <div className="flex flex-col items-center border border-cyan/20 p-2">
          <span className="text-magenta">BREAK</span>
          <span>SPACE</span>
        </div>
        <div className="flex flex-col items-center border border-cyan/20 p-2">
          <span className="text-magenta">UNIT</span>
          <span>SNAKE</span>
        </div>
      </div>
    </div>
  );
};
