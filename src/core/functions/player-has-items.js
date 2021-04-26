/**
 * Function to determine if player has all items.
 * @param {import("../player.type").Player} player
 * @param {import("../expression.type").PlayerHasItems['args']} args
 * @returns {[boolean, import("../game-event.type.js").GameEvent[]]}
 */
export const playerHasItems = (player, args) => {
  /**
   * @type {import("../game-event.type.js").GameEvent[]}
   */
  const events = [];

  const hasItems = args.every(
    (arg) => player.inventory.find((item) => item.id === arg.objectId) != null,
  );

  return [hasItems, events];
};
