/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").RoomHasObjects['args']} args
 */
export const roomHasObjects = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  return args.objectIds.every(
    (objectId) => room.objects.find((object) => object.id === objectId) != null,
  );
};
