import { createInterface } from "node:readline";
import { createEngine } from "./core/engine.js";
import { game } from "./games/dungeon.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "What do you want to do? ",
});

const engine = createEngine({ inputManager: rl, gameSource: game });

engine.emitter.on("event", (args) => console.log(args));

engine.start();
