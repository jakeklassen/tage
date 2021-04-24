import { GameObject } from "./game-object.type";

export interface Player {
  currentRoomId: string;
  lastItemUsedId?: string;
  inventory: GameObject[];
}
