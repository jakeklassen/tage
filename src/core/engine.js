import { processExpression } from "./process-expression.js";
import { EventEmitter } from "events";

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

/**
 * Engine factory
 * @param {Object} args
 * @param {import('readline').Interface} args.inputManager
 * @param {import("./game.type").Game} args.gameSource
 */
export const createEngine = ({ inputManager, gameSource: game }) => {
  return {
    emitter: new EventEmitter(),

    start() {
      inputManager.prompt();
      inputManager.on("line", (answer) => this.loop(answer));
      inputManager.on("close", () => {
        this.quit();
      });
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
            console.log(`Dropped ${itemName}`);
          } else {
            console.log(`You are not carrying ${itemName}`);
          }

          break;
        }

        case "look": {
          console.log(look(game));

          break;
        }

        case "inventory": {
          console.log(describeInventory(game));
          break;
        }

        case "go": {
          const direction = rest.join(" ");
          const exit = getRoomExit(game, game.player.currentRoomId, direction);

          if (!exit) {
            // console.log(`Cannot go ${direction}`);
            this.emitter.emit("event", {
              message: `cannot go ${direction}`,
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
            console.warn("room not found!");

            break;
          }

          const object = currentRoom.objects.find(
            (object) => object.name.toLowerCase() === item,
          );

          if (object == null) {
            console.log(`${item} is not in the room.`);

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
          console.log('Enter a command. Type "help" for more information');
          break;
      }

      inputManager.prompt();
    },

    isGameOver() {},

    quit() {
      console.log("Quitting game\n");
      process.exit(0);
    },
  };
};
