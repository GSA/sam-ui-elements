import { DateTimeDisplayPipe } from './date-time-display.pipe';
import * as moment from 'moment/moment';

describe('src/app/app-pipes/date-time-display.pipe.spec.ts', () => {
  let pipe = new DateTimeDisplayPipe();

  it('FilterMultiArrayObjectPipe Test: Not found', () => {
    let datetime = moment().subtract(1,"hour");  
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(datetime.format("HH:ss a"));
  });

  it('FilterMultiArrayObjectPipe Test: Not nested: Single array', () => {
    let datetime = moment().subtract(1,"month");  
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(datetime.format("MMMM DD"));
  });

  it('FilterMultiArrayObjectPipe Test: Nested array', () => {
    let datetime = moment().subtract(1,"year");  
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(datetime.format("MMMM DD, YYYY")); //second level
  });
});
