import random from 'random';
import { Evaluable } from './pmcs-interface';

function keyOfMaxValue(dict: { [key: number]: number }): number | null {
  let maximumKey: number | null = null;
  for (let key in dict) {
    if (maximumKey === null || dict[key] > dict[maximumKey]) {
      maximumKey = parseInt(key);
    }
  }
  return maximumKey;
}

export function evaluateNextMove(
  context: Evaluable,
  rounds: number = 2500
): number | null {
  let moveScores: { [key: number]: number } = {};
  for (let move of context.moves()) {
    moveScores[move] = 0;

    for (let round = 0; round < rounds; ++round) {
      moveScores[move] += playout(context, move, context.currentPlayer())
        ? 1
        : 0;
    }
  }

  console.log(moveScores);

  return keyOfMaxValue(moveScores); // todo randomize on tiebreakers
}

function playout(context: Evaluable, move: number, aiState: number): boolean {
  let workingContext = context.simulateMove(move);

  while (!workingContext.over()) {
    let moves = workingContext.moves();
    let currentMove = moves[random.int(0, moves.length - 1)];
    workingContext.applyMove(currentMove);
  }

  return workingContext.winningPlayer() === aiState;
}
