/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerDropItem['args']} args
 */
export const playerDropItem = (game, args) => {
  const objectId = args.objectId.trim().toLowerCase();
  const object = game.player.inventory.find((object) => object.id === objectId);
  const currentRoom = game.rooms.find(
    (room) => room.id === game.player.currentRoomId,
  );

  if (object == null) {
    console.warn(`${objectId} not in inventory`);

    return false;
  }

  if (currentRoom == null) {
    console.warn("Possible bug, player is not in a room....");

    return false;
  }

  game.player.inventory = game.player.inventory.filter(
    (object) => object.id !== objectId,
  );

  currentRoom.objects.push(object);

  return true;
};
