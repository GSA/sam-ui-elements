import { PageService } from "./page.service";

describe("PageService", () => {
  describe("isolated tests", () => {
    let service: PageService;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      service = new PageService();
    });

    it("should set a sidebar value", function () {
      service.sidebar = true;
      expect(service.sidebar).toBe(true);
      expect(service.sidebarColumns).toBe("3");
      expect(service.mainContentColumns).toBe("9");
      service.wideSidebar = true;
      expect(service.wideSidebar).toBe(true);
      expect(service.sidebarColumns).toBe("4");
      expect(service.mainContentColumns).toBe("8");
      service.sidebar = false;
      expect(service.sidebar).toBe(false);
      expect(service.sidebarColumns).toBe("");
      expect(service.mainContentColumns).toBe("12");
    });
  });
});
