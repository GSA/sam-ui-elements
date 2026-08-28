import { SamFormService } from "./form-service";
import { AbstractControl } from "@angular/forms";

describe("SamFormService", () => {
  let service: SamFormService;

  beforeEach(() => {
    service = new SamFormService();
  });

  it("fireSubmit emits a submit event with the given root control", () => {
    const received: unknown[] = [];
    service.formEventsUpdated$.subscribe((event) => received.push(event));

    const root = { name: "root" } as unknown as AbstractControl;
    service.fireSubmit(root);

    expect(received).toEqual([{ root, eventType: "submit" }]);
  });

  it("fireSubmit defaults root to undefined", () => {
    const received: unknown[] = [];
    service.formEventsUpdated$.subscribe((event) => received.push(event));

    service.fireSubmit();

    expect(received).toEqual([{ root: undefined, eventType: "submit" }]);
  });

  it("fireReset emits a reset event with the given root control", () => {
    const received: unknown[] = [];
    service.formEventsUpdated$.subscribe((event) => received.push(event));

    const root = { name: "root" } as unknown as AbstractControl;
    service.fireReset(root);

    expect(received).toEqual([{ root, eventType: "reset" }]);
  });

  it("fireReset defaults root to undefined", () => {
    const received: unknown[] = [];
    service.formEventsUpdated$.subscribe((event) => received.push(event));

    service.fireReset();

    expect(received).toEqual([{ root: undefined, eventType: "reset" }]);
  });
});
