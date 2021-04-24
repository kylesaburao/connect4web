export interface Evaluable {
  moves(): number[];
  applyMove(move: number): boolean;
  simulateMove(move: number): Evaluable;
  over(): boolean;
  winner(): string;
  currentPlayer(): number
  winningPlayer(): number;
}
