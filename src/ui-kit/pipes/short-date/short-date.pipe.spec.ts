import { ShortDatePipe } from './short-date.pipe';
import * as moment from 'moment/moment';

describe('A pipe for shorter time formats', () => {
  const pipe = new ShortDatePipe();

  it('should show only time if date is same day as now', () => {
    const todayNoon = moment().set('hour', 12);
    const todayEleven = moment().set('hour', 11);
    const display = pipe.transform(todayEleven, todayNoon);
    // formatter converts A to AM or PM, so add 2 to format length
    expect(display.length).toEqual(pipe.sameDayFormat.length + 2);
  });

  /**
   * TODO: After we uprgaded moment.js to fix a security vulnerability, many of 
   * our filters broke. Most of the tests through the app need to be fixed.
   */

  xit('should show month day time if date is same year as now', () => {
    const jan1 = moment().set('month', 1).set('day', 1);
    const jan2 = moment().set('month', 1).set('day', 2);
    const display = pipe.transform(jan1, jan2);
    expect(display.length).toEqual(pipe.sameYearFormat.length + 2);
  });

  xit('should show month day year if date is not this year', () => {
    const thisYear = moment();
    const lastYear = moment().subtract('year', 1);
    const display = pipe.transform(lastYear, thisYear);
    expect(display.length).toEqual(pipe.differentYearFormat.length + 2);
  });
});
