/** Wrapping index for arrow, Home and End keys; null when the key does not navigate. */
export const nextListIndex = (
  key: string,
  current: number,
  count: number,
  horizontal = true
): number | null => {
  if (count === 0) return null;
  const last = count - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return last;
  if (key === 'ArrowDown' || (horizontal && key === 'ArrowRight'))
    return current < 0 ? 0 : (current + 1) % count;
  if (key === 'ArrowUp' || (horizontal && key === 'ArrowLeft'))
    return current < 0 ? last : (current + last) % count;
  return null;
};
