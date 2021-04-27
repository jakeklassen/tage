import { objectHasObjects } from "./functions/object-has-objects.js";
import { playerChangeRoom } from "./functions/player-change-room.js";
import { playerDropItem } from "./functions/player-drop-item.js";
import { playerHasItems } from "./functions/player-has-items.js";
import { playerPickupItem } from "./functions/player-pickup-item.js";
import { playerTransferInventoryItemsToObject } from "./functions/player-transfer-inventory-items-to-object.js";
import { playerUsedItem } from "./functions/player-used-item.js";
import { roomAddObjects } from "./functions/room-add-objects.js";
import { roomHasObjects } from "./functions/room-has-objects.js";
import { roomRemoveObjects } from "./functions/room-remove-objects.js";
import { roomUpdateObjectRoomDescription } from "./functions/room-update-object-room-description.js";

/**
 *
 * @param {import("./game.type.js").Game} game
 * @param {import("./expression.type").Condition} condition
 * @returns {import("./game-function.type.js").GameFunctionReturnType}
 */
const processCondition = (game, condition) => {
  if (condition.command === "if") {
    const [ifSuccess, ifEvents] = condition.if.reduce((results, expression) => {
      const [expressionSuccess, expressionEvents] = processExpression(
        game,
        expression,
      );

      results[0] &&= expressionSuccess;
      results[1].push(...expressionEvents);

      return results;
    }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([true, []]));

    if (ifSuccess) {
      if (Array.isArray(condition.then)) {
        return condition.then.reduce((results, expression) => {
          const [expressionSuccess, expressionEvents] = processExpression(
            game,
            expression,
          );

          results[0] &&= expressionSuccess;
          results[1].push(...expressionEvents);

          return results;
        }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([true, ifEvents]));
      }

      const thenCondition = processCondition(game, condition.then);
      thenCondition[1].push(...ifEvents);

      return thenCondition;
    } else if (condition.else != null) {
      if (Array.isArray(condition.else)) {
        return condition.else.reduce((results, expression) => {
          const [expressionSuccess, expressionEvents] = processExpression(
            game,
            expression,
          );

          results[0] &&= expressionSuccess;
          results[1].push(...expressionEvents);

          return results;
        }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([true, ifEvents]));
      }

      const elseCondition = processCondition(game, condition.else);
      elseCondition[1].push(...ifEvents);

      return elseCondition;
    } else {
      return [ifSuccess, ifEvents];
    }
  } else {
    const [unlessSuccess, unlessEvents] = condition.unless.reduce(
      (results, expression) => {
        const [expressionSuccess, expressionEvents] = processExpression(
          game,
          expression,
        );

        results[0] &&= expressionSuccess;
        results[1].push(...expressionEvents);

        return results;
      },
      /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([
        true,
        [],
      ]),
    );

    if (unlessSuccess === false) {
      if (Array.isArray(condition.then)) {
        return condition.then.reduce((results, expression) => {
          const [expressionSuccess, expressionEvents] = processExpression(
            game,
            expression,
          );

          results[0] &&= expressionSuccess;
          results[1].push(...expressionEvents);

          return results;
        }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([true, unlessEvents]));
      } else {
        const thenCondition = processCondition(game, condition.then);
        thenCondition[1].push(...unlessEvents);

        return thenCondition;
      }
    } else if (condition.else != null) {
      if (Array.isArray(condition.else)) {
        return condition.else.reduce((results, expression) => {
          const [expressionSuccess, expressionEvents] = processExpression(
            game,
            expression,
          );

          results[0] &&= expressionSuccess;
          results[1].push(...expressionEvents);

          return results;
        }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]} */ ([true, unlessEvents]));
      } else {
        const elseCondition = processCondition(game, condition.else);
        elseCondition[1].push(...unlessEvents);

        return elseCondition;
      }
    } else {
      return [unlessSuccess, unlessEvents];
    }
  }
};

/**
 *
 * @param {import("./game.type.js").Game} game
 * @param {import("./expression.type").Expression} expression
 * @returns {[boolean, import("./game-event.type.js").GameEvent[]]}
 */
export const processExpression = (game, expression) => {
  try {
    if (expression.command === "if" || expression.command == "unless") {
      return processCondition(game, expression);
    }

    if (expression.command === "showMessage") {
      /**
       * @type {import("./game-event.type.js").GameEvent[]}
       */
      const events = [["showMessage", expression.args]];

      return [true, events];
    }

    if (expression.command === "playerUsedItem") {
      return playerUsedItem(game.player, expression.args);
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

    return [false, []];
  } catch (error) {
    // TODO handle error
    console.error(error);

    return [false, []];
  }
};
