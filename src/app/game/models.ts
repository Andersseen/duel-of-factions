export type Faction = "forest" | "granite" | "tides" | "sun";
export type Difficulty = "easy" | "normal" | "hard";
export type Row = "melee" | "ranged" | "siege";
export interface CardDefinition {
  id: string;
  f: string;
  name: string[];
  power: number;
  row: string;
  ability: string;
  art: number;
  max: number;
  group: string;
  unit: boolean;
}
export interface CardInstance {
  id: string;
  uid: number;
}
export type Deck = Record<string, number>;
export interface Player {
  f: string;
  deck: CardInstance[];
  hand: CardInstance[];
  grave: CardInstance[];
  rows: CardInstance[][];
  horn: ({ id?: string; uid?: number; leader?: boolean } | null)[];
  passed: boolean;
  wins: number;
  leader: boolean;
}
export interface Action {
  kind: string;
  uid?: number;
  row?: number;
  target?: number | null;
}
export interface GameLog {
  key: string;
  args: (string | number)[];
}
export interface GameState {
  difficulty: string;
  players: Player[];
  weather: { side: number; card: CardInstance }[];
  spent: { side: number; card: CardInstance }[];
  round: number;
  turn: number;
  starter: number;
  history: [number, number][];
  log: GameLog[];
  pending: { side: number } | null;
  over: boolean;
  winner: number | null;
}
export interface SoundSettings {
  music: boolean;
  effects: boolean;
  volume: number;
}
export type CardSeed = [
  string,
  string,
  string,
  number,
  string,
  string,
  number,
  number,
  string?,
];
