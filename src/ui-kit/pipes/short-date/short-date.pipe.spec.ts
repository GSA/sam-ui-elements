import { ShortDatePipe } from './short-date.pipe';
import * as moment from 'moment/moment';

describe('A pipe for shorter time formats', () => {
  let pipe = new ShortDatePipe();

  it('should show only time if date is same day as now', () => {
    let todayNoon = moment().set('hour', 12);
    let todayEleven = moment().set('hour', 11);
    let display = pipe.transform(todayEleven, todayNoon);
    // formatter converts A to AM or PM, so add 1 to format length
    expect(display.length).toEqual(pipe.sameDayFormat.length + 1);
  });

  it('should show month day time if date is same year as now', () => {
    let jan1 = moment().set('month', 1).set('day', 1);
    let jan2 = moment().set('month', 1).set('day', 2);
    let display = pipe.transform(jan1, jan2);
    expect(display.length).toEqual(pipe.sameYearFormat.length + 1);
  });

  it('should show month day year if date is not this year', () => {
    let thisYear = moment();
    let lastYear = moment().subtract('year', 1);
    let display = pipe.transform(lastYear, thisYear);
    expect(display.length).toEqual(pipe.differentYearFormat.length + 1);
  });
});
