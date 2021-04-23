export interface Evaluable {
  moves(): number[];
  applyMove(move: number): void;
  simulateMove(move: number): Evaluable;
  over(): boolean;
  winner(): string;
}
