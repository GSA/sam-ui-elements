import { ShortDatePipe } from "./short-date.pipe";
import moment from "moment";

describe("A pipe for shorter time formats", () => {
  const pipe = new ShortDatePipe();

  it("should show only time if date is same day as now", () => {
    const todayNoon = moment().set("hour", 12);
    const todayEleven = moment().set("hour", 11);
    const display = pipe.transform(todayEleven, todayNoon);
    // formatter converts A to AM or PM, so add 2 to format length
    expect(display.length).toEqual(pipe.sameDayFormat.length + 2);
  });

  /**
   * TODO: After we uprgaded moment.js to fix a security vulnerability, many of
   * our filters broke. Most of the tests through the app need to be fixed.
   */

  it("should show month day time if date is a different day within the same year as now", () => {
    const now = moment("2024-06-15T12:00:00Z");
    const earlierThisYear = moment("2024-03-01T09:00:00Z");
    const display = pipe.transform(earlierThisYear, now);
    expect(display).toBe(earlierThisYear.format(pipe.sameYearFormat));
  });

  it("should show month day year if the date is in a different year than now", () => {
    const now = moment("2024-06-15T12:00:00Z");
    const lastYear = moment("2023-06-15T12:00:00Z");
    const display = pipe.transform(lastYear, now);
    expect(display).toBe(lastYear.format(pipe.differentYearFormat));
  });

  it("should default to the current time when no fakeNow is provided", () => {
    const display = pipe.transform(moment());
    // sameDayFormat is h:mmA; h is unpadded (1-2 digits) depending on the
    // hour, so assert the pattern rather than a fixed length that would be
    // flaky across different times of day.
    expect(display).toMatch(/^\d{1,2}:\d{2}(AM|PM)$/);
  });
});
