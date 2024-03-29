import mitt from "mitt";
import { playerHasItems } from "./functions/player-has-items.js";
import { processExpression } from "./process-expression.js";

const HELP_TEXT = `Commands:

 - drop: Drop an item from inventory
 - interact: COMING SOON!
 - examine: Examine an object in the room
 - go: Go direction. North, East, South and West are valid
 - help: Show commands
 - inventory: Show inventory
 - look: Look around the room
 - pickup: Try to pickup object in the room
 - use: Attempt to use an item from inventory on an object in the room
 - q/quit: Quit game
`;

const parseInput = (line = "") => {
  const [command, ...args] = line
    .split(" ")
    .map((el) => el.trim().toLowerCase())
    .filter((el) => el !== "");

  return [command, ...args];
};

/**
 *
 * @param {import('./game.type').Game} game
 * @param {string} roomId
 * @param {string} direction
 */
const getRoomExit = (game, roomId, direction) => {
  const room = game.rooms.find((room) => room.id === roomId);

  let exit = null;

  switch (direction) {
    case "north":
    case "east":
    case "south":
    case "west": {
      exit = room?.objects.find(
        (object) => object.id === `${direction}ern_exit`,
      );
      break;
    }
    default:
      break;
  }

  return exit;
};

/**
 *
 * @param {import("./game.type").Game} game
 * @param {string} objectId
 * @returns {import("./expression.type").Expression[]}
 */
function examineObject(game, objectId) {
  const name = objectId.trim().toLowerCase();

  const object = game.rooms
    .find((room) => room.id === game.player.currentRoomId)
    ?.objects.find((object) => object.id === objectId);

  if (object == null) {
    return [
      {
        command: "showMessage",
        args: {
          message: `Cannot find ${name} in room.`,
        },
      },
    ];
  }

  if (object.commands.examine == null) {
    return [
      {
        command: "showMessage",
        args: {
          message: object.roomDescription,
        },
      },
    ];
  }

  return object.commands.examine;
}

/**
 *
 * @param {import("./game.type").Game} game
 * @returns
 */
const look = (game) => {
  const currentRoom = game.rooms.find(
    (room) => room.id === game.player.currentRoomId,
  );

  let message = `${currentRoom?.description}\n\nYou see: \n\n`;

  if (currentRoom?.objects.length === 0) {
    message += "An empty room...";
  } else {
    currentRoom?.objects
      .filter((object) => object.roomDescription != null)
      .forEach((object) => {
        message += ` - ${object.roomDescription}\n`;
      });
  }

  return message;
};

/**
 *
 * @param {import("./game.type").Game} game
 * @returns
 */
const describeInventory = (game) => {
  let message = `Inventory (${game.player.inventory.length}):\n\n`;

  if (game.player.inventory.length === 0) {
    message += "You have no items";
  } else {
    game.player.inventory.forEach((item) => {
      message += ` - ${item.inventoryDescription}\n`;
    });
  }

  return message;
};

export class Engine {
  /**
   * @type {import('readline').Interface}
   */
  #inputManager;

  /**
   * @type {import("./game.type").Game}
   */
  #game;

  #emitter = mitt();

  /**
   * Create new Engine
   * @param {Object} args
   * @param {import('readline').Interface} args.inputManager
   * @param {import("./game.type").Game} args.gameSource
   */
  constructor(args) {
    this.#game = args.gameSource;
    this.#inputManager = args.inputManager;
  }

  start() {
    this.emit("showMessage", {
      message: this.#game.introText,
    });

    this.#inputManager.prompt();
    this.#inputManager.on("line", (answer) => this.loop(answer));
    this.#inputManager.on("close", () => {
      this.quit();
    });
  }

  /**
   *
   * @template {keyof import("./game-event.type.js").GameEventMap} T
   * @param {T} event
   * @param {import("./game-event.type.js").GameEventMap[T]} handler
   */
  on(event, handler) {
    this.#emitter.on(event, handler);
  }

  /**
   * @template {keyof import("./game-event.type.js").GameEventMap} T
   * @param {T} event
   * @param {Parameters<import("./game-event.type.js").GameEventMap[T]>[0]} data
   */
  emit(event, data) {
    this.#emitter.emit(event, data);
  }

  /**
   *
   * @param {import('./expression.type').Expression | import('./expression.type').Expression[]} expressions
   */
  processCommand(expressions) {
    const boxed = Array.isArray(expressions) ? expressions : [expressions];

    const [expressionResult, events] = boxed.reduce((results, expression) => {
      const [expressionResult, expressionEvents] = processExpression(
        this.#game,
        expression,
      );
      results[0] &&= expressionResult;
      results[1].push(...expressionEvents);

      return results;
    }, /** @type {[boolean, import("./game-event.type.js").GameEvent[]]}  */ ([true, []]));

    for (const [event, data] of events) {
      this.emit(event, data);
    }

    return expressionResult;
  }

  /**
   * Game loop
   * @param {string} answer
   */
  loop(answer) {
    const [command = "", ...rest] = parseInput(answer);

    switch (command) {
      case "help": {
        this.emit("showMessage", {
          message: HELP_TEXT,
        });

        break;
      }

      case "interact": {
        this.emit("showMessage", {
          message: "COMING SOON!",
        });

        break;
      }

      case "drop": {
        const itemName = rest.join(" ");

        this.processCommand({
          command: "playerDropItem",
          args: {
            objectId: itemName,
          },
        });

        break;
      }

      case "look": {
        this.emit("showMessage", {
          message: look(this.#game),
        });

        break;
      }

      case "inventory": {
        this.emit("showMessage", {
          message: describeInventory(this.#game),
        });

        break;
      }

      case "go": {
        const direction = rest.join(" ");
        const exit = getRoomExit(
          this.#game,
          this.#game.player.currentRoomId,
          direction,
        );

        if (!exit) {
          this.emit("showMessage", {
            message: `\nCannot go ${direction}\n`,
          });

          break;
        }

        this.processCommand(exit.commands.go);
        break;
      }

      case "examine": {
        const objectId = rest.join(" ");
        const examineCommand = examineObject(this.#game, objectId);
        this.processCommand(examineCommand);

        break;
      }

      case "pickup": {
        const item = rest.join(" ");

        const currentRoom = this.#game.rooms.find(
          (room) => room.id === this.#game.player.currentRoomId,
        );

        if (currentRoom == null) {
          this.emit("warning", {
            message: `room ${
              this.#game.player.currentRoomId
            } not found in game`,
          });

          break;
        }

        const object = currentRoom.objects.find(
          (object) => object.name.toLowerCase() === item,
        );

        if (object == null) {
          this.emit("showMessage", {
            message: `${item} is not in the room.`,
          });

          break;
        }

        this.processCommand(object.commands.pickup);
        break;
      }

      case "use": {
        const [itemName, targetObjectName] = rest
          .join(" ")
          .split("on")
          .map((words) => words.trim());

        const [playerHasItem] = playerHasItems(this.#game.player, [
          { objectId: itemName },
        ]);

        if (playerHasItem === false) {
          this.emit("showMessage", {
            message: `You don't have ${itemName}`,
          });

          break;
        }

        const target = this.#game.rooms
          .find((room) => room.id === this.#game.player.currentRoomId)
          ?.objects.find((object) => object.id === targetObjectName);

        if (!target) {
          this.emit("showMessage", {
            message: `Cound not find ${targetObjectName} in room.`,
          });

          break;
        }

        if (!target.commands.use) {
          this.emit("showMessage", {
            message: `Cannot use ${itemName} on ${targetObjectName}.`,
          });

          break;
        }

        this.#game.player.lastItemUsedId = itemName;

        this.processCommand(target.commands.use);

        break;
      }

      case "q":
      case "quit":
        this.#inputManager.close();
        break;

      case "": {
        this.emit("showMessage", {
          message: 'Enter a command. Type "help" for more information',
        });

        break;
      }

      default: {
        this.emit("showMessage", {
          message: `\nUnrecognized command '${command}'\n`,
        });
      }
    }

    if (this.isGameOver()) {
      this.emit("showMessage", {
        message: this.#game.youWinText,
      });
      this.quit();
    }

    this.#inputManager.prompt();
  }

  isGameOver() {
    return this.processCommand(this.#game.winConditions);
  }

  quit() {
    this.emit("showMessage", {
      message: "Quitting game\n",
    });

    process.exit(0);
  }
}
