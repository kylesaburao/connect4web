import random from 'random';
import { Evaluable } from './pmcs-interface';

type Score = number;
type Moves = number[];
type ScoreMap = Map<Score, Moves>;

function selectMaximizingMove(map: ScoreMap): number | null {
  let maxScore: number | null = null;
  map.forEach((moves, score) => {
    if (maxScore === null || score > maxScore) {
      maxScore = score;
    }
  });

  if (maxScore !== null) {
    const maximizingMoves: Moves = <Moves>map.get(maxScore);
    return maximizingMoves[random.int(0, maximizingMoves.length - 1)]
  }

  return null;
}

export function evaluateNextMove(
  context: Evaluable,
  rounds: number = 2500
): Promise<number | null> {
  return new Promise<number | null>((resolve) => {
    let scores = new Map<Score, Moves>();

    for (let move of context.moves()) {
      let score = 0;

      for (let round = 0; round < rounds; ++round) {
        score += playout(context, move, context.currentPlayer())
          ? 1
          : 0;
      }

      if (scores.has(score)) {
        scores.get(score)?.push(move);
      } else {
        scores.set(score, [move]);
      }
    }

    let key = selectMaximizingMove(scores);
    resolve(key);
  });
}

function playout(context: Evaluable, move: number, aiState: number): boolean {
  let workingContext = context.simulateMove(move);

  while (!workingContext.over()) {
    let moves = workingContext.moves();
    let currentMove = moves[random.int(0, moves.length - 1)];
    workingContext.applyMove(currentMove);
  }

  return (
    workingContext.winningPlayer() === aiState ||
    workingContext.winningPlayer() === workingContext.defaultState()
  );
}
