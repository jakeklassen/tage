import { GameEvent } from "./game-event.type";
import { Game } from "./game.type";

export type GameFunctionReturnType = [success: boolean, events: GameEvent[]];
