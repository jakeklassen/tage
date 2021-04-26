/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerPickupItem['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerPickupItem = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const objectId = args.objectId.trim().toLowerCase();

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

  const itemIdx = room.objects.findIndex((object) => object.id === objectId);

  if (itemIdx === -1) {
    events.push([
      "warning",
      {
        message: `item ${objectId} not found`,
      },
    ]);

    return [false, events];
  }

  const item = room.objects[itemIdx];
  game.player.inventory.push(item);

  room.objects = room.objects.filter((object, idx) => idx !== itemIdx);

  return [true, events];
};
