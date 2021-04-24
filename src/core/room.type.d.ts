import { GameObject } from "./game-object.type";

export interface Room {
  id: string;
  name: string;
  description: string;
  objects: GameObject[];
}
