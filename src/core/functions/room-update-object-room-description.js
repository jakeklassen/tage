/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").RoomUpdateObjectRoomDescription['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const roomUpdateObjectRoomDescription = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const roomObjectId = args.roomObjectId.trim().toLowerCase();
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

  const roomObject = room.objects.find((object) => object.id === roomObjectId);

  if (roomObject == null) {
    events.push([
      "warning",
      {
        message: `room object ${roomObject} not found`,
      },
    ]);

    return [false, events];
  }

  roomObject.roomDescription = args.roomDescription;

  return [true, events];
};
