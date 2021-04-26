/**
 * Determine if last item the player used matches the item of interest.
 * @param {import("../player.type").Player} player
 * @param {import("../expression.type").PlayerUsedItem['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerUsedItem = (player, args) => {
  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  return [player.lastItemUsedId === args.objectId, events];
};
