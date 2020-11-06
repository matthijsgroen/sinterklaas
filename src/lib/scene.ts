export const delay = (amount: number): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, amount));

let onKeyPress: (() => void) | null = null;

document.addEventListener("keypress", () => {
  if (onKeyPress) {
    const item = onKeyPress;
    onKeyPress = null;
    item();
  }
});

document.addEventListener("click", () => {
  if (onKeyPress) {
    const item = onKeyPress;
    onKeyPress = null;
    item();
  }
});

document.addEventListener("touchend", () => {
  // this enables the normal click
});

export const pause = (autoContinue: number | null = null): Promise<void> =>
  new Promise(resolve => {
    const timeout =
      autoContinue !== null ? setTimeout(resolve, autoContinue) : undefined;

    onKeyPress = () => {
      clearTimeout(timeout);
      resolve();
    };
  });
