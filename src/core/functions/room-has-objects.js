/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").RoomHasObjects['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const roomHasObjects = (game, args) => {
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

  return [
    args.objectIds.every(
      (objectId) =>
        room.objects.find((object) => object.id === objectId) != null,
    ),
    events,
  ];
};
