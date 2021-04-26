import mitt from "mitt";
import { processExpression } from "./process-expression.js";

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

    return boxed.every((expression) =>
      processExpression(this.#game, expression),
    );
  }

  /**
   * Game loop
   * @param {string} answer
   */
  loop(answer) {
    const [command, ...rest] = parseInput(answer);

    switch (command) {
      case "drop": {
        const itemName = rest.join(" ");
        const success = this.processCommand({
          command: "playerDropItem",
          args: {
            objectId: itemName,
          },
        });

        if (success) {
          this.emit("showMessage", {
            message: `Dropped ${itemName}`,
          });
        } else {
          this.emit("showMessage", {
            message: `You are not carrying ${itemName}`,
          });
        }

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
            message: `Cannot go ${direction}`,
          });

          break;
        }

        this.processCommand(exit.commands.go);
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

      case "q":
      case "quit":
        this.#inputManager.close();
        break;

      case "":
        this.emit("showMessage", {
          message: 'Enter a command. Type "help" for more information',
        });
        break;
    }

    this.#inputManager.prompt();
  }

  isGameOver() {}

  quit() {
    this.emit("showMessage", {
      message: "Quitting game\n",
    });

    process.exit(0);
  }
}

/**
 * Engine factory
 * @param {Object} args
 * @param {import('readline').Interface} args.inputManager
 * @param {import("./game.type").Game} args.gameSource
 */
export const createEngine = ({ inputManager, gameSource: game }) => {
  const emitter = mitt();

  return {
    game,

    start() {
      this.emit("showMessage", {
        message: game.introText,
      });

      inputManager.prompt();
      inputManager.on("line", (answer) => this.loop(answer));
      inputManager.on("close", () => {
        this.quit();
      });
    },

    /**
     *
     * @template {keyof import("./game-event.type.js").GameEventMap} T
     * @param {T} event
     * @param {import("./game-event.type.js").GameEventMap[T]} handler
     */
    on(event, handler) {
      emitter.on(event, handler);
    },

    /**
     * @template {keyof import("./game-event.type.js").GameEventMap} T
     * @param {T} event
     * @param {Parameters<import("./game-event.type.js").GameEventMap[T]>[0]} data
     */
    emit(event, data) {
      emitter.emit(event, data);
    },

    /**
     *
     * @param {import('./expression.type').Expression | import('./expression.type').Expression[]} expressions
     */
    processCommand(expressions) {
      const boxed = Array.isArray(expressions) ? expressions : [expressions];

      return boxed.every((expression) => processExpression(game, expression));
    },

    /**
     * Game loop
     * @param {string} answer
     */
    loop(answer) {
      const [command, ...rest] = parseInput(answer);

      switch (command) {
        case "drop": {
          const itemName = rest.join(" ");
          const success = this.processCommand({
            command: "playerDropItem",
            args: {
              objectId: itemName,
            },
          });

          if (success) {
            this.emit("showMessage", {
              message: `Dropped ${itemName}`,
            });
          } else {
            this.emit("showMessage", {
              message: `You are not carrying ${itemName}`,
            });
          }

          break;
        }

        case "look": {
          this.emit("showMessage", {
            message: look(game),
          });

          break;
        }

        case "inventory": {
          this.emit("showMessage", {
            message: describeInventory(game),
          });

          break;
        }

        case "go": {
          const direction = rest.join(" ");
          const exit = getRoomExit(game, game.player.currentRoomId, direction);

          if (!exit) {
            this.emit("showMessage", {
              message: `Cannot go ${direction}`,
            });

            break;
          }

          this.processCommand(exit.commands.go);
          break;
        }

        case "pickup": {
          const item = rest.join(" ");

          const currentRoom = game.rooms.find(
            (room) => room.id === game.player.currentRoomId,
          );

          if (currentRoom == null) {
            this.emit("warning", {
              message: `room ${game.player.currentRoomId} not found in game`,
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

        case "q":
        case "quit":
          inputManager.close();
          break;

        case "":
          this.emit("showMessage", {
            message: 'Enter a command. Type "help" for more information',
          });
          break;
      }

      inputManager.prompt();
    },

    isGameOver() {},

    quit() {
      this.emit("showMessage", {
        message: "Quitting game\n",
      });

      process.exit(0);
    },
  };
};
