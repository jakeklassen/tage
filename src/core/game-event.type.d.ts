export type GameEventMap = {
  showMessage: (data?: { message: string }) => void;
  warning: (data?: { message: string }) => void;
  error: (data?: { message: string }) => void;
};

export type GameEvent = {
  [K in keyof GameEventMap]: [K, Parameters<GameEventMap[K]>[0]];
}[keyof GameEventMap];

export type FunctionResultMap = {
  true: GameEvent[];
  false: GameEvent[];
};
