import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {
  public sameDayFormat: string = 'h:mmA';
  public sameYearFormat: string = 'MMM DD h:mmA';
  public differentYearFormat: string = 'MMM DD YYYY h:mmA';

  // fake now is added for testability. It is difficult to test based on the
  // clock of the system.
  transform(dateStr, fakeNow?): string {
    const date = moment(dateStr);
    const now = fakeNow || moment();

    if (date.isSame(now, 'day')) {
      return date.format(this.sameDayFormat);
    }
    if (date.isSame(now, 'year')) {
      return date.format(this.sameYearFormat);
    }
    return date.format(this.differentYearFormat);
  }
}

