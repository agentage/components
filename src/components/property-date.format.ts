/** "Nov 25", with the year when it is not the current one. Server-safe. */
export const formatPropertyDate = (d: Date, today: Date = new Date()): string =>
  d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(d.getFullYear() === today.getFullYear() ? {} : { year: 'numeric' }),
  });
