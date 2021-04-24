import { objectHasObjects } from "./functions/object-has-objects.js";
import { playerChangeRoom } from "./functions/player-change-room.js";
import { playerDropItem } from "./functions/player-drop-item.js";
import { playerHasItems } from "./functions/player-has-items.js";
import { playerPickupItem } from "./functions/player-pickup-item.js";
import { playerTransferInventoryItemsToObject } from "./functions/player-transfer-inventory-items-to-object.js";
import { roomAddObjects } from "./functions/room-add-objects.js";
import { roomHasObjects } from "./functions/room-has-objects.js";
import { roomRemoveObjects } from "./functions/room-remove-objects.js";
import { roomUpdateObjectRoomDescription } from "./functions/room-update-object-room-description.js";

/**
 *
 * @param {import("./game.type").Game} game
 * @param {import("./expression.type").Expression} expression
 * @returns {boolean}
 */
export const processExpression = (game, expression) => {
  try {
    if (expression.command === "if") {
      const result = expression.if.reduce(
        (res, ifExpression) => res && processExpression(game, ifExpression),
        true,
      );

      if (result) {
        if (Array.isArray(expression.then)) {
          return expression.then.reduce(
            (res, thenExpression) =>
              res && Array.isArray(thenExpression)
                ? thenExpression.reduce(
                    (thenRes, thenThenExpression) =>
                      thenRes && thenThenExpression,
                    true,
                  )
                : processExpression(game, thenExpression),
            true,
          );
        }
      }

      if (expression.else) {
        if (Array.isArray(expression.else)) {
          return expression.else.reduce(
            (res, elseExpression) =>
              res && Array.isArray(elseExpression)
                ? elseExpression.reduce(
                    (elseRes, elseElseExpression) =>
                      elseRes && elseElseExpression,
                    true,
                  )
                : processExpression(game, elseExpression),
            true,
          );
        }
      }
    }

    if (expression.command === "unless") {
      const result = expression.unless.reduce(
        (res, unlessExpression) =>
          res && processExpression(game, unlessExpression),
        true,
      );

      if (result === false) {
        if (Array.isArray(expression.else)) {
          return expression.else.reduce(
            (res, elseExpression) =>
              res && Array.isArray(elseExpression)
                ? elseExpression.reduce(
                    (elseRes, elseElseExpression) =>
                      elseRes && elseElseExpression,
                    true,
                  )
                : processExpression(game, elseExpression),
            true,
          );
        }
      }

      if (expression.else) {
        if (Array.isArray(expression.else)) {
          return expression.else.reduce(
            (res, elseExpression) =>
              res && Array.isArray(elseExpression)
                ? elseExpression.reduce(
                    (elseRes, elseElseExpression) =>
                      elseRes && elseElseExpression,
                    true,
                  )
                : processExpression(game, elseExpression),
            true,
          );
        }
      }
    }

    if (expression.command === "showMessage") {
      console.log(expression.args);

      return true;
    }

    if (expression.command === "playerChangeRoom") {
      return playerChangeRoom(game, expression.args);
    }

    if (expression.command === "playerHasItems") {
      return playerHasItems(game.player, expression.args);
    }

    if (expression.command === "playerPickupItem") {
      return playerPickupItem(game, expression.args);
    }

    if (expression.command === "playerDropItem") {
      return playerDropItem(game, expression.args);
    }

    if (expression.command === "roomAddObjects") {
      return roomAddObjects(game, expression.args);
    }

    if (expression.command === "roomRemoveObjects") {
      return roomRemoveObjects(game, expression.args);
    }

    if (expression.command === "objectHasObjects") {
      return objectHasObjects(game, expression.args);
    }

    if (expression.command === "playerTransferInventoryItemsToObject") {
      return playerTransferInventoryItemsToObject(game, expression.args);
    }

    if (expression.command === "roomHasObjects") {
      return roomHasObjects(game, expression.args);
    }

    if (expression.command === "roomUpdateObjectRoomDescription") {
      return roomUpdateObjectRoomDescription(game, expression.args);
    }

    return false;
  } catch (error) {
    // TODO handle error
    console.error(error);

    return false;
  }
};
