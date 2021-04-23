import { GameContext } from '../game-context';
import random from 'random';

function temp() {
  let c: GameContext = new GameContext();
  console.log('hi')

  return
  // playout
  while (!c.over()) {
    let moves = c.moves();
    let selectedMove = moves[randomInt(0, moves.length)];
    c.applyMove(selectedMove);
  }
}

function randomInt(min: number, max: number): number {
  return random.int(min, max);
}

temp()