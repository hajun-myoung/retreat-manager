export const MIN_DICE_VALUE = 1;
export const MAX_DICE_VALUE = 4;

export function rollD4() {
  return Math.floor(Math.random() * MAX_DICE_VALUE) + MIN_DICE_VALUE;
}

