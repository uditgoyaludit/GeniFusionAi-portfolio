import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GameState {
  ball: { x: number; y: number; dx: number; dy: number; width: number; height: number };
  paddle1: { y: number; height: number; width: number; speed: number };
  paddle2: { y: number; height: number; width: number; speed: number };
  score: { player1: number; player2: number };
  canvasWidth: number;
  canvasHeight: number;
}

function GamePingPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUserControl, setIsUserControl] = useState(false);
  const gameStateRef = useRef<GameState>({
    ball: { x: 400, y: 300, dx: 2, dy: 2, width: 80, height: 30 },
    paddle1: { y: 250, height: 100, width: 15, speed: 8 },
    paddle2: { y: 250, height: 100, width: 15, speed: 8 },
    score: { player1: 0, player2: 0 },
    canvasWidth: 800,
    canvasHeight: 600,
  });

  const restartGame = () => {
    gameStateRef.current = {
      ...gameStateRef.current,
      ball: { x: 400, y: 300, dx: 2, dy: 2, width: 80, height: 30 },
      paddle1: { y: 250, height: 100, width: 15, speed: 8 },
      paddle2: { y: 250, height: 100, width: 15, speed: 8 },
      score: { player1: 0, player2: 0 },
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isUserControl) return;
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const { paddle1, canvasHeight } = gameStateRef.current;
      paddle1.y = Math.max(0, Math.min(canvasHeight - paddle1.height, mouseY - paddle1.height / 2));
      console.log('User controlling paddle1:', paddle1.y); // Debugging
    };

    if (isUserControl) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const gameLoop = () => {
      const { ball, paddle1, paddle2, score, canvasWidth, canvasHeight } = gameStateRef.current;

      // Clear canvas
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1F2937' : '#F3F4F6';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw paddles
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#1F2937';
      ctx.fillRect(10, paddle1.y, paddle1.width, paddle1.height);
      ctx.fillRect(canvasWidth - paddle2.width - 10, paddle2.y, paddle2.width, paddle2.height);

      // Draw ball as code block
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#374151' : '#FFFFFF';
      ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#10B981' : '#1F2937';
      ctx.font = '16px monospace';
      ctx.fillText('{x += 5}', ball.x + 10, ball.y + 20);

      // Draw scores
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#1F2937';
      ctx.font = '24px monospace';
      ctx.fillText(`${score.player1}`, canvasWidth / 4, 50);
      ctx.fillText(`${score.player2}`, (3 * canvasWidth) / 4, 50);

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collisions with top/bottom
      if (ball.y <= 0 || ball.y + ball.height >= canvasHeight) {
        ball.dy *= -1;
      }

      // Ball collisions with paddles
      if (
        (ball.x <= paddle1.width + 10 &&
          ball.y + ball.height >= paddle1.y &&
          ball.y <= paddle1.y + paddle1.height) ||
        (ball.x + ball.width >= canvasWidth - paddle2.width - 10 &&
          ball.y + ball.height >= paddle2.y &&
          ball.y <= paddle2.y + paddle2.height)
      ) {
        ball.dx *= -1;
      }

      // Ball out of bounds
      if (ball.x < 0) {
        score.player2 += 1;
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.dx = 2;
        ball.dy = 2;
      } else if (ball.x + ball.width > canvasWidth) {
        score.player1 += 1;
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.dx = -2;
        ball.dy = 2;
      }

      // Auto-move paddle2 (always)
      const targetY = ball.y + ball.height / 2 - paddle2.height / 2;
      paddle2.y = Math.max(0, Math.min(canvasHeight - paddle2.height, targetY));

      // Auto-move paddle1 only if not user-controlled
      if (!isUserControl) {
        paddle1.y = Math.max(0, Math.min(canvasHeight - paddle1.height, targetY));
      }

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isUserControl]);

  return (
    <section className="py-16 text-center">
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Ping Pong Code Game
      </motion.h2>
      <p className="text-lg mb-4">
        {isUserControl ? 'Control the left paddle with your mouse!' : 'Watch the paddles autoplay !'}
      </p>
      <motion.div
        className="mb-8 flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >

      </motion.div>
      <canvas
        ref={canvasRef}
        width={gameStateRef.current.canvasWidth}
        height={gameStateRef.current.canvasHeight}
        className="mx-auto border border-gray-300 dark:border-gray-700"
      />
    </section>
  );
}

export default GamePingPong;