import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';
// import 'moment-timezone';

@Pipe({name: 'dateTimeDisplay'})
export class DateTimeDisplayPipe implements PipeTransform {
  transform(datetime: any): any {
    if (datetime === undefined) {
        console.warn('Invalid value passed into DateTimeDisplayPipe');
        return undefined;
    }
    const m = moment(datetime);
    const now = moment();
    const difference = moment.duration(now.diff(m));
    
    if (difference.asDays() < 1) {
        return m.format('HH:mm a');
    } else if (difference.asDays() >= 1 && m.year() === now.year()) {
        return m.format('MMM DD');
    } else {
        return m.format('MMM DD, YYYY');
    }
  }
}
