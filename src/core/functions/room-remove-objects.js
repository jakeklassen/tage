/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").RoomRemoveObjects['args']} args
 */
export const roomRemoveObjects = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  for (const objectId of args.objectIds) {
    room.objects = room.objects.filter((object) => object.id === objectId);
  }

  return true;
};
