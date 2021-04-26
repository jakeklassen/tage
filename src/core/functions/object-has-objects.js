/**
 * Evaluate the `object_has_objects` game expression. Search room objects for
 * each object in `objects`.
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").ObjectHasObjects['args']} queries
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const objectHasObjects = (game, queries) => {
  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  const hasObjects = queries.every(
    (query) =>
      game.rooms
        .find((room) => room.id === query.roomId)
        ?.objects.find((object) => object.id === query.haystackObjectId)
        ?.objects.find((object) => object.id === query.needleObjectId) != null,
  );

  return [hasObjects, events];
};
