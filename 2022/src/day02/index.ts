import { mod } from '../lib/mod';

class Round {
  player: string;
  opponent: string;

  constructor(player: string, opponent: string) {
    this.player = player;
    this.opponent = opponent;
  }

  toString(): string {
    return this.opponent + ' ' + this.player;
  }

  getShapeIndentifier(shape: string): number {
    switch (shape) {
      case 'X':
        return 0;
      case 'Y':
        return 1;
      case 'Z':
        return 2;
      case 'A':
        return 0;
      case 'B':
        return 1;
      case 'C':
        return 2;
      default:
        throw new Error('Shape not recognized: ' + shape);
    }
  }

  getShapeScore(): number {
    return this.getShapeIndentifier(this.player) + 1;
  }

  getCorrectShapeScore(): number {
    let opponentShapeIdentifier: number = this.getShapeIndentifier(this.opponent);
    let winIndicator: number = this.getShapeIndentifier(this.player);
    return mod(opponentShapeIdentifier + winIndicator - 1, 3) + 1;
  }

  getRoundScore(): number {
    let playerShape: number = this.getShapeIndentifier(this.player);
    let opponentShape: number = this.getShapeIndentifier(this.opponent);
    let difference: number = mod(playerShape - opponentShape, 3);
    return mod(difference + 1, 3) * 3;
  }

  getCorrectRoundScore(): number {
    return this.getShapeIndentifier(this.player) * 3;
  }
}

function parseRounds(input: string[]): Round[] {
  return input.map(line => {
    let strategy: string[] = line.split(' ');
    return new Round(strategy[1], strategy[0]);
  });
}

export function findScore(input: string[]): number {
  let rounds: Round[] = parseRounds(input);
  let score: number = 0;
  for (let round of rounds) {
    score += round.getShapeScore() + round.getRoundScore();
  }
  return score;
}

export function findCorrectScore(input: string[]): number {
  let rounds: Round[] = parseRounds(input);
  let score: number = 0;
  for (let round of rounds) {
    score += round.getCorrectShapeScore() + round.getCorrectRoundScore();
  }
  return score;
}
