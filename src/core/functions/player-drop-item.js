/**
 *
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").PlayerDropItem['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerDropItem = (game, args) => {
  const objectId = args.objectId.trim().toLowerCase();
  const object = game.player.inventory.find((object) => object.id === objectId);
  const currentRoom = game.rooms.find(
    (room) => room.id === game.player.currentRoomId,
  );

  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  if (object == null) {
    events.push([
      "showMessage",
      {
        message: `You are not carrying ${objectId}`,
      },
    ]);

    return [false, events];
  }

  if (currentRoom == null) {
    events.push([
      "warning",
      {
        message: `Possible bug, player current room ${game.player.currentRoomId} not found`,
      },
    ]);

    return [false, events];
  }

  game.player.inventory = game.player.inventory.filter(
    (object) => object.id !== objectId,
  );

  currentRoom.objects.push(object);

  return [true, events];
};
