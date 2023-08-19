import React, { useEffect, useRef, useState } from "react";
import "../static/styles/App.css";
import AppleLogo from "../static/apple.png";
import useInterval from "./useInterval";

// Constants for canvas size and initial game state
const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [[4, 10], [4, 10]];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 80;

const App = () => {
	// References and state hooks for game entities and game status
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [snake, setSnake] = useState(initialSnake);
	const [apple, setApple] = useState(initialApple);
	const [direction, setDirection] = useState([0, -1]);
	const [delay, setDelay] = useState<number | null>(null);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);

	// Custom hook to run the game logic at a regular interval
	useInterval(() => runGame(), delay);

	// Render the game entities (snake & apple) on canvas
	useEffect(() => {
		let fruit = document.getElementById("fruit") as HTMLCanvasElement;
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.setTransform(scale, 0, 0, scale, 0, 0);
				ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
				ctx.fillStyle = "#fff000";
				snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
				ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
			}
		}
	}, [snake, apple, gameOver]);

	/**
	 * Updates the high score in local storage if the current score exceeds the previous high score.
	 */
	const handleSetScore = () => {
		if (score > Number(localStorage.getItem("snakeScore"))) {
			localStorage.setItem("snakeScore", JSON.stringify(score));
		}
	}

	/**
	 * Resets the game state to its initial state.
	 */
	const play = () => {
		setSnake(initialSnake);
		setApple(initialApple);
		setDirection([1, 0]);
		setDelay(timeDelay);
		setScore(0);
		setGameOver(false);
	}

	/**
	 * Checks if the snake's head has collided with the canvas edges or any part of its body.
	 *
	 * @param head - An array containing the x and y coordinates of the snake's head.
	 * @returns {boolean} - Returns `true` if a collision is detected, otherwise `false`.
	 */
	const checkCollision = (head: number[]) => {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true;
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true;
		}
		return false;
	}

	/**
	 * Determines if the snake has eaten the apple.
	 *
	 * @param newSnake - The updated array representing the snake after a move.
	 * @returns {boolean} - Returns `true` if the apple is eaten, otherwise `false`.
	 */
	const appleAte = (newSnake: number[][]) => {
		let coord = apple.map(() => Math.floor(Math.random() * canvasX / scale));
		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			let newApple = coord;
			setScore(score + 1);
			setApple(newApple);
			return true;
		}
		return false;
	}

	/**
	 * Contains the core game logic:
	 * - Moves the snake in its current direction.
	 * - Checks for collisions and apple consumption.
	 * - Updates the game state accordingly.
	 */
	const runGame = () => {
		const newSnake = [...snake];
		const newSnakeHead = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];
		newSnake.unshift(newSnakeHead);
		if (checkCollision(newSnakeHead)) {
			setDelay(null);
			setGameOver(true);
			handleSetScore();
		}
		if (!appleAte(newSnake)) {
			newSnake.pop();
		}
		setSnake(newSnake);
	}

	/**
	 * Changes the direction of the snake based on the arrow key pressed by the user.
	 *
	 * @param e - A React keyboard event.
	 */
	const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>) => {
		switch (e.key) {
			case "ArrowLeft":
				setDirection([-1, 0]);
				break;
			case "ArrowUp":
				setDirection([0, -1]);
				break;
			case "ArrowRight":
				setDirection([1, 0]);
				break;
			case "ArrowDown":
				setDirection([0, 1]);
				break;
		}
	}

	// Render the game UI components
	return (
		<div onKeyDown={(e) => changeDirection(e)}>
			<img id="fruit" src={AppleLogo} alt="fruit" width="30" />
			<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			{gameOver && <div className="gameOver">Game Over</div>}
			<button onClick={play} className="playButton">Play</button>
			<div className="scoreBox">
				<h2>Score: {score}</h2>
				<h2>High Score: {localStorage.getItem("snakeScore")}</h2>
			</div>
		</div>
	);
}

export default App;
