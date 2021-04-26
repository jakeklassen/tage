/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").RoomRemoveObjects['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const roomRemoveObjects = (game, args) => {
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

  for (const objectId of args.objectIds) {
    room.objects = room.objects.filter((object) => object.id !== objectId);
  }

  return [true, events];
};
