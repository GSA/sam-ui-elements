import { DateTimeDisplayPipe } from "./date-time-display.pipe";
import moment from "moment";

describe("DateTimeDisplayPipe test", () => {
  const pipe = new DateTimeDisplayPipe();

  it("FilterMultiArrayObjectPipe Test: Not found", () => {
    const datetime = moment().subtract(1, "hour");
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(
      datetime.format("HH:ss a")
    );
  });

  it("formats a date a day or more old but still within this year as MMM DD", () => {
    const datetime = moment("2024-01-01T12:00:00Z");
    vi.setSystemTime(new Date("2024-01-05T12:00:00Z"));
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(
      datetime.format("MMM DD")
    );
    vi.useRealTimers();
  });

  it("FilterMultiArrayObjectPipe Test: Nested array", () => {
    const datetime = moment().subtract(1, "year");
    expect(pipe.transform(datetime.format("YYYY-MM-DD HH:ss"))).toEqual(
      datetime.format("MMM DD, YYYY")
    ); // second level
  });

  it("warns and returns undefined when the input is undefined", () => {
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    expect(pipe.transform(undefined)).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      "Invalid value passed into DateTimeDisplayPipe"
    );
    warnSpy.mockRestore();
  });
});
