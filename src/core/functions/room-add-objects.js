/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").RoomAddObjects['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const roomAddObjects = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
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

  for (const object of args.objects) {
    room.objects.push(object);
  }

  return [true, events];
};
