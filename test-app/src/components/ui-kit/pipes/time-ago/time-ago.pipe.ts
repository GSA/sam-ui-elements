import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeago',
 // WARNING: If this is not set to false, values won't update unless the Object
 // or Array reference changes: https://stackoverflow.com/questions/34456430/
 // ngfor-doesnt-update-data-with-pipe-in-angular2
})
export class TimeAgoPipe implements PipeTransform {
  transform(datetime: number): string {
    return moment(datetime).fromNow();
  }
}
