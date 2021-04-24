/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").RoomAddObjects['args']} args
 */
export const roomAddObjects = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  for (const object of args.objects) {
    room.objects.push(object);
  }

  return true;
};
