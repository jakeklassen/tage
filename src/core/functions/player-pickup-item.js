/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerPickupItem['args']} args
 */
export const playerPickupItem = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const objectId = args.objectId.trim().toLowerCase();

  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  const item = room.objects.find((object) => object.id === objectId);

  // TODO handle error
  if (item == null) {
    console.warn(`item ${objectId} not found`);

    return false;
  }

  game.player.inventory.push(item);
  room.objects = room.objects.filter((object) => object.id !== objectId);

  return true;
};
