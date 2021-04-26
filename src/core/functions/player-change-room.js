/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerChangeRoom['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerChangeRoom = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  if (room == null) {
    events.push([
      "showMessage",
      {
        message: `Room ${roomId} not found`,
      },
    ]);

    return [false, events];
  }

  game.player.currentRoomId = roomId;

  return [true, events];
};
