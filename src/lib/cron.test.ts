import { describe, expect, it } from 'vitest';
import { describeCron } from './cron';

const FROM = new Date('2026-11-01T12:00:00Z');
const iso = (dates: Date[]): string[] => dates.map((d) => d.toISOString());

describe('describeCron text', () => {
  it.each([
    ['* * * * *', 'Every minute'],
    ['*/15 * * * *', 'Every 15 minutes'],
    ['0 * * * *', 'Every hour'],
    ['30 * * * *', 'Every hour at minute 30'],
    ['10 */6 * * *', 'Every 6 hours at minute 10'],
    ['0 9 * * *', 'Every day at 09:00'],
    ['0 9 * * 1-5', 'At 09:00 on Monday to Friday'],
    ['0 9 * * MON-FRI', 'At 09:00 on Monday to Friday'],
    ['30 18 * * 0,6', 'At 18:30 on Saturday and Sunday'],
    ['0 9 * * 5-7', 'At 09:00 on Friday to Sunday'],
    ['0 9 * * 7', 'At 09:00 on Sunday'],
    ['0 0 1 * *', 'At 00:00 on day 1 of the month'],
    ['0,30 8 * * *', 'At 08:00 and 08:30'],
    ['* 9 * * *', 'Every minute during 09:xx'],
    ['0,30 * * * *', 'At minute 0 and 30 of every hour'],
    ['0 9-17 * * *', 'Every hour from 09:00 to 17:00'],
    ['*/20 9-17 * * *', 'At minute 0, 20 and 40 past hours 9 to 17'],
    ['* 9,14 * * *', 'Every minute during 09:xx and 14:xx'],
    ['0 0 1 JAN *', 'At 00:00 on day 1 of the month in January'],
    ['0 0 1,15 * MON', 'At 00:00 on days 1 and 15 of the month or Monday'],
    ['*/45 * * * *', 'At minute 0 and 45 of every hour'],
    ['0 */5 * * *', 'At minute 0 past hours 0, 5, 10, 15 and 20'],
    ['*/30 * * * *', 'Every 30 minutes'],
    ['@hourly', 'Every hour'],
    ['@daily', 'Every day at 00:00'],
    ['@midnight', 'Every day at 00:00'],
    ['@weekly', 'At 00:00 on Sunday'],
    ['@monthly', 'At 00:00 on day 1 of the month'],
    ['@YEARLY', 'At 00:00 on day 1 of the month in January'],
    ['@annually', 'At 00:00 on day 1 of the month in January'],
  ])('describes %s', (expr, text) => {
    expect(describeCron(expr, { from: FROM }).text).toBe(text);
  });

  it('appends the zone name', () => {
    expect(describeCron('0 9 * * *', { timeZone: 'UTC' }).text).toBe('Every day at 09:00 (UTC)');
    expect(describeCron('0 9 * * *', { timeZone: 'Europe/Kyiv' }).text).toBe(
      'Every day at 09:00 (Europe/Kyiv)'
    );
  });
});

describe('describeCron next', () => {
  it('returns three times after from by default', () => {
    expect(iso(describeCron('*/15 * * * *', { from: FROM, timeZone: 'UTC' }).next)).toEqual([
      '2026-11-01T12:15:00.000Z',
      '2026-11-01T12:30:00.000Z',
      '2026-11-01T12:45:00.000Z',
    ]);
  });

  it('honours count and excludes from itself', () => {
    const { next } = describeCron('0 12 * * *', { from: FROM, timeZone: 'UTC', count: 2 });
    expect(iso(next)).toEqual(['2026-11-02T12:00:00.000Z', '2026-11-03T12:00:00.000Z']);
    expect(describeCron('* * * * *', { from: FROM, count: 0 }).next).toEqual([]);
  });

  it('supports lists, ranges, steps with a range and names', () => {
    const list = describeCron('5,10 13 * * *', { from: FROM, timeZone: 'UTC' });
    expect(iso(list.next)[0]).toBe('2026-11-01T13:05:00.000Z');
    expect(iso(list.next)[1]).toBe('2026-11-01T13:10:00.000Z');
    const stepped = describeCron('1-30/10 14 * * *', { from: FROM, timeZone: 'UTC' });
    expect(iso(stepped.next)).toEqual([
      '2026-11-01T14:01:00.000Z',
      '2026-11-01T14:11:00.000Z',
      '2026-11-01T14:21:00.000Z',
    ]);
    const named = describeCron('0 0 1 DEC,jan *', { from: FROM, timeZone: 'UTC', count: 2 });
    expect(iso(named.next)).toEqual(['2026-12-01T00:00:00.000Z', '2027-01-01T00:00:00.000Z']);
  });

  it('treats weekday 7 as Sunday', () => {
    const { next } = describeCron('0 0 * * 7', { from: FROM, timeZone: 'UTC', count: 1 });
    expect(iso(next)).toEqual(['2026-11-08T00:00:00.000Z']);
  });

  it('applies the day-of-month OR weekday rule when both are restricted', () => {
    const from = new Date('2026-10-31T12:00:00Z');
    const { next } = describeCron('0 0 1 * 1', { from, timeZone: 'UTC' });
    expect(iso(next)).toEqual([
      '2026-11-01T00:00:00.000Z',
      '2026-11-02T00:00:00.000Z',
      '2026-11-09T00:00:00.000Z',
    ]);
  });

  it('evaluates in a non-UTC zone without DST', () => {
    const { next } = describeCron('0 9 * * *', { from: FROM, timeZone: 'Asia/Tokyo' });
    expect(iso(next)).toEqual([
      '2026-11-02T00:00:00.000Z',
      '2026-11-03T00:00:00.000Z',
      '2026-11-04T00:00:00.000Z',
    ]);
  });

  it('follows the offset change when DST ends', () => {
    const from = new Date('2026-10-30T12:00:00Z');
    const { next } = describeCron('0 9 * * *', { from, timeZone: 'America/New_York' });
    expect(iso(next)).toEqual([
      '2026-10-30T13:00:00.000Z',
      '2026-10-31T13:00:00.000Z',
      '2026-11-01T14:00:00.000Z',
    ]);
  });

  it('runs a gap time at the first valid minute, once', () => {
    const from = new Date('2027-03-13T12:00:00Z');
    const ny = describeCron('30 2 * * *', { from, timeZone: 'America/New_York' });
    expect(iso(ny.next)).toEqual([
      '2027-03-14T07:00:00.000Z',
      '2027-03-15T06:30:00.000Z',
      '2027-03-16T06:30:00.000Z',
    ]);
    const berlin = describeCron('0,30 2 * * *', {
      from: new Date('2027-03-27T12:00:00Z'),
      timeZone: 'Europe/Berlin',
      count: 2,
    });
    expect(iso(berlin.next)).toEqual(['2027-03-28T01:00:00.000Z', '2027-03-29T00:00:00.000Z']);
  });

  it('finds yearly and leap-day schedules beyond one year', () => {
    const yearly = describeCron('30 2 8 3 *', { from: FROM, timeZone: 'UTC' });
    expect(iso(yearly.next)).toEqual([
      '2027-03-08T02:30:00.000Z',
      '2028-03-08T02:30:00.000Z',
      '2029-03-08T02:30:00.000Z',
    ]);
    const leap = describeCron('0 0 29 2 *', { from: FROM, timeZone: 'UTC' });
    expect(leap.next).toHaveLength(3);
    expect(iso(leap.next)[0]).toBe('2028-02-29T00:00:00.000Z');
  });

  it('skips past hours today and stops at count', () => {
    const { next } = describeCron('* * * * *', {
      from: new Date('2026-11-01T12:30:30Z'),
      timeZone: 'Europe/Berlin',
      count: 2,
    });
    expect(iso(next)).toEqual(['2026-11-01T12:31:00.000Z', '2026-11-01T12:32:00.000Z']);
  });
});

describe('describeCron errors', () => {
  it.each([
    ['', 'five fields'],
    ['* * * *', 'five fields'],
    ['* * * * * *', 'five fields'],
    ['60 * * * *', 'minute'],
    ['* 24 * * *', 'hour'],
    ['* * 0 * *', 'day of month'],
    ['* * * 13 *', 'month'],
    ['* * * * 8', 'weekday'],
    ['*/0 * * * *', 'minute'],
    ['5-1 * * * *', 'minute'],
    ['a * * * *', 'minute'],
    ['1,,2 * * * *', 'minute'],
    ['0 0 31 2 *', 'never occurs'],
  ])('rejects %j', (expr, reason) => {
    const result = describeCron(expr, { from: FROM });
    expect(result.text).toBe('');
    expect(result.next).toEqual([]);
    expect(result.error).toContain(reason);
  });

  it('rejects a bad time zone and an invalid start date without throwing', () => {
    const zone = describeCron('0 9 * * *', { timeZone: 'Mars/Base', from: FROM });
    expect(zone).toMatchObject({ text: '', next: [] });
    expect(zone.error).toContain('Mars/Base');
    expect(describeCron('0 9 * * *', { from: new Date('nope') }).error).not.toContain('time zone');
    expect(describeCron('0 9 * * *', { from: new Date('nope') }).error).toBeDefined();
  });
});
