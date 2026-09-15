import { SidenavService } from "./sidenav.service";

describe("SidenavService", () => {
  let service: SidenavService;

  beforeEach(() => {
    service = new SidenavService();
  });

  it("stores and returns children via setChildren()", () => {
    const children = [{ label: "a" }];
    expect(service.setChildren(children)).toBe(children);
  });

  it("stores the model via setModel()", () => {
    const model = { label: "root" };
    service.setModel(model);
    // No direct getter for the model itself, but getSelectedModel() reads
    // from it, so exercise that path to confirm it was actually stored.
    expect(service.getSelectedModel()).toBe(model);
  });

  describe("updateData()", () => {
    it("appends a new index when the depth has not been set yet", () => {
      service.updateData(0, 2);
      expect(service.getData()).toEqual([2]);
    });

    it("overwrites the index at an already-set depth", () => {
      service.updateData(0, 2);
      service.updateData(0, 3);
      expect(service.getData()).toEqual([3]);
    });

    it("truncates any deeper indices when updating a shallower depth", () => {
      service.updateData(0, 1);
      service.updateData(1, 2);
      service.updateData(2, 3);
      service.updateData(0, 5);
      expect(service.getData()).toEqual([5]);
    });
  });

  describe("overrideData()", () => {
    it("appends a new index when the depth has not been set yet", () => {
      service.overrideData(0, 2);
      expect(service.getData()).toEqual([2]);
    });

    it("overwrites the index at an already-set depth and trims deeper indices", () => {
      service.updateData(0, 1);
      service.updateData(1, 2);
      service.overrideData(0, 5);
      expect(service.getData()).toEqual([5]);
    });

    it("does not trim when there are no deeper indices to remove", () => {
      service.overrideData(0, 1);
      service.overrideData(0, 2);
      expect(service.getData()).toEqual([2]);
    });
  });

  describe("getSelectedModel()", () => {
    it("walks the model's children using the stored index path", () => {
      const model = {
        children: [
          { label: "a", children: [{ label: "a-1" }] },
          { label: "b" },
        ],
      };
      service.setModel(model);
      service.updateData(0, 0);
      service.updateData(1, 0);
      const selected = service.getSelectedModel();
      expect(selected.label).toBe("a-1");
      expect(selected.selection).toEqual([0, 0]);
    });
  });

  describe("getPath()", () => {
    it("builds a path by concatenating each node's route", () => {
      const model = {
        children: [
          {
            label: "a",
            route: "alpha",
            children: [{ label: "a-1", route: "alpha-one" }],
          },
        ],
      };
      service.setModel(model);
      service.updateData(0, 0);
      service.updateData(1, 0);
      expect(service.getPath()).toBe("alphaalpha-one");
    });

    it("prefixes a slash and warns when a node has no route", () => {
      const warnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => undefined);
      const model = {
        children: [{ label: "no-route", route: undefined }],
      };
      service.setModel(model);
      service.updateData(0, 0);

      const path = service.getPath();

      expect(path).toBe("/undefined");
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
