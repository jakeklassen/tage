import { GameObject } from "./game-object.type";

type ShowMessage = {
  command: "showMessage";
  args: {
    message: string;
  };
};

type ObjectHasObjects = {
  command: "objectHasObjects";
  args: {
    roomId: string;
    haystackObjectId: string;
    needleObjectId: string;
  }[];
};

type PlayerChangeRoom = {
  command: "playerChangeRoom";
  args: {
    roomId: string;
  };
};

type PlayerPickupItem = {
  command: "playerPickupItem";
  args: {
    roomId: string;
    objectId: string;
  };
};

type PlayerDropItem = {
  command: "playerDropItem";
  args: {
    objectId: string;
  };
};

type PlayerHasItems = {
  command: "playerHasItems";
  args: {
    objectId: string;
  }[];
};

type PlayerUsedItem = {
  command: "playerUsedItem";
  args: {
    objectId: string;
  };
};

type PlayerTransferInventoryItemsToObject = {
  command: "playerTransferInventoryItemsToObject";
  args: {
    roomId: string;
    roomObjectId: string;
    inventoryItemIds: string[];
  };
};

type RoomAddObjects = {
  command: "roomAddObjects";
  args: {
    roomId: string;
    objects: GameObject[];
  };
};

type RoomRemoveObjects = {
  command: "roomRemoveObjects";
  args: {
    roomId: string;
    objectIds: string[];
  };
};

type RoomHasObjects = {
  command: "roomHasObjects";
  args: {
    roomId: string;
    objectIds: string[];
  };
};

type RoomUpdateObjectRoomDescription = {
  command: "roomUpdateObjectRoomDescription";
  args: {
    roomId: string;
    roomObjectId: string;
    roomDescription: string;
  };
};

type If = {
  command: "if";
  if: Expression[];
  then: Expression[] | Condition;
  else?: Expression[] | Condition;
};

type Unless = {
  command: "unless";
  unless: Expression[];
  then: Expression[] | Condition;
  else?: Expression[] | Condition;
};

export type Condition = If | Unless;

export type Expression =
  | Condition
  | RoomAddObjects
  | RoomRemoveObjects
  | RoomHasObjects
  | RoomUpdateObjectRoomDescription
  | ShowMessage
  | ObjectHasObjects
  | PlayerChangeRoom
  | PlayerPickupItem
  | PlayerTransferInventoryItemsToObject
  | PlayerDropItem
  | PlayerUsedItem
  | PlayerHasItems;
