import { describe, expect, it } from 'vitest';
import { RANGE_PRESETS, formatRange, parseRelativeRange, resolveDateRange } from './relative-range';

const NOW = new Date(2026, 10, 22, 14, 30, 0);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe('parseRelativeRange', () => {
  it('parses every preset with its own label', () => {
    for (const preset of RANGE_PRESETS) {
      const range = parseRelativeRange(preset.value, NOW);
      expect(range, preset.value).not.toBeNull();
      expect(range?.label).toBe(preset.label);
    }
  });

  it('parses shorthand durations ending at now', () => {
    const cases: [string, number, string][] = [
      ['15m', 15 * MIN, 'Last 15 minutes'],
      ['6h', 6 * HOUR, 'Last 6 hours'],
      ['2d', 2 * DAY, 'Last 2 days'],
      ['1w', 7 * DAY, 'Last week'],
    ];
    for (const [input, span, label] of cases) {
      const range = parseRelativeRange(input, NOW);
      expect(range?.to).toEqual(NOW);
      expect(NOW.getTime() - (range?.from.getTime() ?? 0)).toBe(span);
      expect(range?.label).toBe(label);
    }
  });

  it('parses worded forms case-insensitively', () => {
    expect(parseRelativeRange('  15 MIN ', NOW)?.label).toBe('Last 15 minutes');
    expect(parseRelativeRange('6 hours', NOW)?.label).toBe('Last 6 hours');
    expect(parseRelativeRange('Last 6h', NOW)?.label).toBe('Last 6 hours');
    expect(parseRelativeRange('last 2 days', NOW)?.label).toBe('Last 2 days');
  });

  it('parses now- expressions', () => {
    const single = parseRelativeRange('now-6h', NOW);
    expect(single?.label).toBe('Last 6 hours');
    expect(single?.from.getTime()).toBe(NOW.getTime() - 6 * HOUR);
    expect(parseRelativeRange('now-6h to now', NOW)?.label).toBe('Last 6 hours');
    const pair = parseRelativeRange('now-2d to now-1d', NOW);
    expect(pair?.from.getTime()).toBe(NOW.getTime() - 2 * DAY);
    expect(pair?.to.getTime()).toBe(NOW.getTime() - DAY);
    expect(pair?.label).toBeUndefined();
  });

  it('parses spaced now - 6h, and a missing number as 1', () => {
    expect(parseRelativeRange('now - 6h', NOW)?.label).toBe('Last 6 hours');
    expect(parseRelativeRange('now - 2d to now - 1d', NOW)?.from.getTime()).toBe(
      NOW.getTime() - 2 * DAY
    );
    expect(parseRelativeRange('now - 6h to now', NOW)?.label).toBe('Last 6 hours');
    for (const [input, label] of [
      ['last hour', 'Last hour'],
      ['Last Week', 'Last week'],
      ['last minute', 'Last minute'],
    ]) {
      expect(parseRelativeRange(input, NOW)?.label).toBe(label);
    }
    expect(parseRelativeRange('hour', NOW)).toBeNull();
  });

  it('parses today and yesterday on local day boundaries', () => {
    const today = parseRelativeRange('today', NOW);
    expect(today?.from).toEqual(new Date(2026, 10, 22));
    expect(today?.to).toEqual(NOW);
    const yesterday = parseRelativeRange('Yesterday', NOW);
    expect(yesterday?.from).toEqual(new Date(2026, 10, 21));
    expect(yesterday?.to).toEqual(new Date(2026, 10, 21, 23, 59, 59, 999));
  });

  it('parses absolute days and ranges without a label', () => {
    const day = parseRelativeRange('2026-11-01', NOW);
    expect(day?.from).toEqual(new Date(2026, 10, 1));
    expect(day?.to).toEqual(new Date(2026, 10, 1, 23, 59, 59, 999));
    expect(day?.label).toBeUndefined();
    const span = parseRelativeRange('2026-11-01 to 2026-11-03', NOW);
    expect(span?.from).toEqual(new Date(2026, 10, 1));
    expect(span?.to).toEqual(new Date(2026, 10, 3, 23, 59, 59, 999));
    const times = parseRelativeRange('2026-11-01T10:00 to 2026-11-01T12:00', NOW);
    expect(times?.from).toEqual(new Date(2026, 10, 1, 10, 0));
    expect(times?.to).toEqual(new Date(2026, 10, 1, 12, 0));
  });

  it('accepts the separators to, " - " and ..', () => {
    const expected = parseRelativeRange('2026-11-01 to 2026-11-03', NOW);
    expect(parseRelativeRange('2026-11-01 - 2026-11-03', NOW)).toEqual(expected);
    expect(parseRelativeRange('2026-11-01..2026-11-03', NOW)).toEqual(expected);
  });

  it('returns null for garbage, zero spans and reversed ranges', () => {
    for (const input of [
      '',
      'banana',
      '0h',
      'last 0 days',
      '2026-02-31',
      '1 to 2',
      'a to b to c',
    ]) {
      expect(parseRelativeRange(input, NOW), input).toBeNull();
    }
    expect(parseRelativeRange('2026-11-03 to 2026-11-01', NOW)).toBeNull();
    expect(parseRelativeRange('now to now', NOW)).toBeNull();
    expect(parseRelativeRange('now-1d to now-2d', NOW)).toBeNull();
  });

  it('uses the injected now and defaults to the current time', () => {
    const other = new Date(2020, 0, 5, 8, 0);
    expect(parseRelativeRange('1h', other)?.to).toEqual(other);
    const before = Date.now();
    const range = parseRelativeRange('1h');
    expect(range?.to.getTime()).toBeGreaterThanOrEqual(before);
  });
});

describe('formatRange', () => {
  it('returns the label when present', () => {
    expect(formatRange({ from: NOW, to: NOW, label: 'Last hour' })).toBe('Last hour');
  });

  it('formats an absolute range', () => {
    const text = formatRange({
      from: new Date(2026, 10, 3, 14, 0),
      to: new Date(2026, 10, 4, 9, 30),
    });
    expect(text).toMatch(/^\S+.*\d.* to .*\d.*$/);
    expect(text).toContain(' to ');
    expect(text).toMatch(/14:00/);
    expect(text).toMatch(/09:30/);
  });
});

describe('resolveDateRange', () => {
  const LATER = new Date(NOW.getTime() + HOUR);

  it('moves a relative range with the clock', () => {
    const range = parseRelativeRange('24h', NOW);
    expect(range?.expression).toBe('now-24h');
    const live = resolveDateRange(range!, LATER);
    expect(live.to).toEqual(LATER);
    expect(live.from.getTime() - range!.from.getTime()).toBe(HOUR);
  });

  it('keeps an absolute range fixed', () => {
    const range = parseRelativeRange('2026-11-01 to 2026-11-03', NOW)!;
    expect(range.expression).toBeUndefined();
    expect(resolveDateRange(range, LATER)).toEqual({ from: range.from, to: range.to });
  });

  it('stores an expression for typed now-6h, last hour, today and pairs with now', () => {
    expect(parseRelativeRange('now-6h', NOW)?.expression).toBe('now-6h');
    expect(parseRelativeRange('now - 6h', NOW)?.expression).toBe('now-6h');
    expect(parseRelativeRange('last hour', NOW)?.expression).toBe('now-1h');
    expect(parseRelativeRange('today', NOW)?.expression).toBe('today');
    const pair = parseRelativeRange('now-2d to now-1d', NOW)!;
    expect(pair.expression).toBe('now-2d to now-1d');
    expect(resolveDateRange(pair, LATER).to.getTime()).toBe(LATER.getTime() - DAY);
    expect(parseRelativeRange('2026-11-01 to now', NOW)?.expression).toBe('2026-11-01 to now');
  });

  it('labels a relative pair without a label by its expression', () => {
    expect(formatRange(parseRelativeRange('now-2d to now-1d', NOW)!)).toBe('now-2d to now-1d');
  });
});
