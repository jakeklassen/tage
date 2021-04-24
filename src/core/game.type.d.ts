import { Expression } from "./expression.type";
import { Player } from "./player.type";
import { Room } from "./room.type";

export interface Game {
  title: string;
  author: string;
  // TODO I like the idea of a onStart event
  introText: string;
  youWinText: string;
  player: Player;
  winConditions: Expression[];
  rooms: Room[];
}
