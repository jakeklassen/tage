/**
 * Evaluate the `object_has_objects` game expression. Search rooms' objects for
 * each object in `objects`.
 * @param {import("../game.type").Game} game
 * @param {import("../expression.type").ObjectHasObjects['args']} queries
 */
export const objectHasObjects = (game, queries) =>
  queries.every(
    (query) =>
      game.rooms
        .find((room) => room.id === query.roomId)
        ?.objects.find((object) => object.id === query.haystackObjectId)
        ?.objects.find((object) => object.id === query.needleObjectId) != null,
  );
