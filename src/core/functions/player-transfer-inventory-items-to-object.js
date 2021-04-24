import { playerHasItems } from "./player-has-items.js";

/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").PlayerTransferInventoryItemsToObject['args']} args
 */
export const playerTransferInventoryItemsToObject = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const roomObjectId = args.roomObjectId.trim().toLowerCase();

  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  const roomObject = room.objects.find((object) => object.id === roomObjectId);

  // TODO handle error
  if (roomObject == null) {
    console.warn(`room object ${roomObject} not found`);

    return false;
  }

  const playerHasAllItems = playerHasItems(
    game.player,
    args.inventoryItemIds.map((objectId) => ({ objectId })),
  );

  if (!playerHasAllItems) {
    console.warn("Player does not have all items");

    return false;
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

  return true;
};
