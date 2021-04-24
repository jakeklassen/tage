/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerChangeRoom['args']} args
 */
export const playerChangeRoom = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`Room ${roomId} not found`);

    return false;
  }

  game.player.currentRoomId = roomId;

  return true;
};
