import { TimeAgoPipe } from "./time-ago.pipe";
import moment from "moment";

describe("TimeAgoPipe", () => {
  const pipe = new TimeAgoPipe();

  it("transforms a datetime into a relative time-ago string", () => {
    const fiveMinutesAgo = moment().subtract(5, "minutes").valueOf();
    expect(pipe.transform(fiveMinutesAgo)).toBe(
      moment(fiveMinutesAgo).fromNow()
    );
  });

  it("transforms the current time to 'a few seconds ago'", () => {
    const now = moment().valueOf();
    expect(pipe.transform(now)).toBe(moment(now).fromNow());
  });
});
