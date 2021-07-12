enum DateTimeInterval
{
    H1 = 'H1',
    H4 = 'H4',
    H6 = 'H6',
    H12 = 'H12',
    D1 = 'D1',
    D2 = 'D2',
    W1 = 'W1',
    W2 = 'W2',
    M1 = 'M1'
}

export default DateTimeInterval;

export const DateTimeIntervalInSeconds = {
    [DateTimeInterval.H1]: 3600,
    [DateTimeInterval.H4]: 4 * 3600,
    [DateTimeInterval.H6]: 6 * 3600,
    [DateTimeInterval.H12]: 12 * 3600,
    [DateTimeInterval.D1]: 24 * 3600,
    [DateTimeInterval.D2]: 2 * 24 * 3600,
    [DateTimeInterval.W1]: 7 * 24 * 3600,
    [DateTimeInterval.W2]: 14 * 24 * 3600,
    [DateTimeInterval.M1]: 30 * 24 * 3600,
};


