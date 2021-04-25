export type GameEvent = {
  showMessage: (data?: { message: string }) => void;
  warning: (data?: { message: string }) => void;
  error: (data?: { message: string }) => void;
};
