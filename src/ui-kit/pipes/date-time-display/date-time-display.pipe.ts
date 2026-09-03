import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";
// import 'moment-timezone';

@Pipe({
  name: "dateTimeDisplay",
  standalone: false,
})
export class DateTimeDisplayPipe implements PipeTransform {
  transform(
    datetime: string | number | Date | undefined
  ): string | undefined {
    if (datetime === undefined) {
      console.warn("Invalid value passed into DateTimeDisplayPipe");
      return undefined;
    }
    const m = moment(datetime);
    const now = moment();
    const difference = moment.duration(now.diff(m));

    if (difference.asDays() < 1) {
      return m.format("HH:mm a");
    } else if (difference.asDays() >= 1 && m.year() === now.year()) {
      return m.format("MMM DD");
    } else {
      return m.format("MMM DD, YYYY");
    }
  }
}
