export interface Player {
  id: string;
  piecesToPlace: number;
  piecesOnBoard: number;
}

export type BoardCell = null | "player1" | "player2";
export type GameStatus = "waiting" | "playing" | "finished";
export type GamePhase = "place" | "move" | "fly";
export type TurnState = "place" | "move" | "remove";
export type PlayerKey = "player1" | "player2";
export type WinReason = "elimination" | "block" | "abandon" | null;

export interface Game {
  id: string;
  code: string;
  status: GameStatus;
  player1: Player;
  player2: Player | null;
  board: BoardCell[];
  phase: GamePhase;
  turn: PlayerKey;
  turnState: TurnState;
  winner: PlayerKey | null;
  winReason: WinReason;
  lastSeen: { player1: number | null; player2: number | null };
  rematchRequested: { player1: boolean; player2: boolean };
  rematchGameCode: string | null;
  createdAt: string;
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;
const BOARD_SIZE = 24;

const store = new Map<string, Game>();

function generateUniqueCode(): string {
  let code: string;
  do {
    code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  } while (store.has(code));
  return code;
}

function createEmptyBoard(): BoardCell[] {
  return Array.from({ length: BOARD_SIZE }, () => null);
}

function createPlayer(): Player {
  return {
    id: crypto.randomUUID(),
    piecesToPlace: 9,
    piecesOnBoard: 0,
  };
}

export function createGame(): Game {
  const player1 = createPlayer();
  const code = generateUniqueCode();
  const game: Game = {
    id: crypto.randomUUID(),
    code,
    status: "waiting",
    player1,
    player2: null,
    board: createEmptyBoard(),
    phase: "place",
    turn: "player1",
    turnState: "place",
    winner: null,
    winReason: null,
    lastSeen: { player1: null, player2: null },
    rematchRequested: { player1: false, player2: false },
    rematchGameCode: null,
    createdAt: new Date().toISOString(),
  };
  store.set(code, game);
  return game;
}

export function getGameByCode(code: string): Game | null {
  return store.get(code) ?? null;
}

export function getGameById(id: string): Game | null {
  for (const game of store.values()) {
    if (game.id === id) return game;
  }
  return null;
}

const joinLocks = new Set<string>();

export function joinGame(code: string): { game: Game; playerId: string } | null {
  if (joinLocks.has(code)) return null;
  joinLocks.add(code);

  try {
    const game = store.get(code);
    if (!game || game.status !== "waiting") return null;

    const player2 = createPlayer();
    game.player2 = player2;
    game.status = "playing";
    return { game, playerId: player2.id };
  } finally {
    joinLocks.delete(code);
  }
}

export function createRematchGame(previousGame: Game): Game {
  const code = generateUniqueCode();
  const loser = previousGame.winner === "player1" ? "player2" : "player1";
  const game: Game = {
    id: crypto.randomUUID(),
    code,
    status: "playing",
    player1: {
      id: previousGame.player1.id,
      piecesToPlace: 9,
      piecesOnBoard: 0,
    },
    player2: {
      id: previousGame.player2!.id,
      piecesToPlace: 9,
      piecesOnBoard: 0,
    },
    board: createEmptyBoard(),
    phase: "place",
    turn: loser,
    turnState: "place",
    winner: null,
    winReason: null,
    lastSeen: { player1: null, player2: null },
    rematchRequested: { player1: false, player2: false },
    rematchGameCode: null,
    createdAt: new Date().toISOString(),
  };
  store.set(code, game);
  return game;
}

/** For testing only */
export function clearStore(): void {
  store.clear();
}
