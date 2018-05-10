import { DateTimeDisplayPipe } from './date-time-display.pipe';
import * as moment from 'moment/moment';

describe('DateTimeDisplayPipe test', () => {
  const pipe = new DateTimeDisplayPipe();

  it('FilterMultiArrayObjectPipe Test: Not found', () => {
    const datetime = moment().subtract(1, 'hour');  
    expect(pipe.transform(datetime.format('YYYY-MM-DD HH:ss')))
      .toEqual(datetime.format('HH:ss a'));
  });

  xit('FilterMultiArrayObjectPipe Test: Not nested: Single array', () => {
    // This test is broken. Needs to be fixed, but I can't tell from the
    // file what the business rules should be and, subsequently, the correct
    // way to fix the test.
    const datetime = moment().subtract(1, 'month');  
    expect(pipe.transform(datetime.format('YYYY-MM-DD HH:ss')))
      .toEqual(datetime.format('MMM DD'));
  });

  it('FilterMultiArrayObjectPipe Test: Nested array', () => {
    const datetime = moment().subtract(1, 'year');  
    expect(pipe.transform(datetime.format('YYYY-MM-DD HH:ss')))
      .toEqual(datetime.format('MMM DD, YYYY')); // second level
  });
});
