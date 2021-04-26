import { playerHasItems } from "./player-has-items.js";

/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").PlayerTransferInventoryItemsToObject['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerTransferInventoryItemsToObject = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const roomObjectId = args.roomObjectId.trim().toLowerCase();

  const room = game.rooms.find((room) => room.id === roomId);

  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  if (room == null) {
    events.push([
      "warning",
      {
        message: `room ${roomId} not found`,
      },
    ]);

    return [false, events];
  }

  const roomObject = room.objects.find((object) => object.id === roomObjectId);

  if (roomObject == null) {
    events.push([
      "warning",
      {
        message: `room object ${roomObject} not found`,
      },
    ]);

    return [false, events];
  }

  const playerHasAllItems = playerHasItems(
    game.player,
    args.inventoryItemIds.map((objectId) => ({ objectId })),
  );

  if (!playerHasAllItems) {
    events.push([
      "warning",
      {
        message: "Player does not have all items",
      },
    ]);

    return [false, events];
  }

  for (const objectId of args.inventoryItemIds) {
    const [object] = game.player.inventory.filter(
      (object) => object.id === objectId,
    );

    game.player.inventory = game.player.inventory.filter(
      (object) => object.id !== objectId,
    );

    roomObject.objects.push(object);
  }

  return [true, events];
};
