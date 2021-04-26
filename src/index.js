import { createInterface } from "node:readline";
// @ts-ignore
import { default as chalk } from "chalk";
import { Engine } from "./core/engine.js";
import { game } from "./games/dungeon.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "What do you want to do? ",
});

const engine = new Engine({ inputManager: rl, gameSource: game });

engine.on("showMessage", (data) => {
  console.log(chalk`{cyan ${data?.message}}`);
});

engine.start();
