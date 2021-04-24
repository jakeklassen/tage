/**
 * Function to determine if player has all items.
 * @param {import("../player.type").Player} player
 * @param {import("../expression.type").PlayerHasItems['args']} args
 */
export const playerHasItems = (player, args) =>
  args.every(
    (arg) => player.inventory.find((item) => item.id === arg.objectId) != null,
  );
