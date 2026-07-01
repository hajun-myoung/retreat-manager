export const MIN_DICE_VALUE = 1;
export const MAX_DICE_VALUE = 6;

export const DICE_WEIGHTS = [
  { value: 1, weight: 14 },
  { value: 2, weight: 15 },
  { value: 3, weight: 16 },
  { value: 4, weight: 17 },
  { value: 5, weight: 18 },
  { value: 6, weight: 20 },
] as const;

export function rollWeightedDice() {
  const totalWeight = DICE_WEIGHTS.reduce((sum, dice) => sum + dice.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const dice of DICE_WEIGHTS) {
    cursor -= dice.weight;

    if (cursor <= 0) {
      return dice.value;
    }
  }

  return MAX_DICE_VALUE;
}
