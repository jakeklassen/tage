import { Expression } from "./expression.type";

export interface GameObject {
  id: string;
  name: string;
  roomDescription: string;
  inventoryDescription?: string;
  objects: GameObject[];
  commands: Record<string, Expression[]>;
}
