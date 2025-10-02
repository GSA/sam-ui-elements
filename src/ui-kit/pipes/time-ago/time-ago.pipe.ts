import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'timeago',
    standalone: false
})
export class TimeAgoPipe implements PipeTransform {
  transform(datetime: number): string {
    return moment(datetime).fromNow();
  }
}
