import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SamMenuItemComponent } from "./";
import { SamSidenavModule } from "../";
import { SidenavService } from "../services";
import { MenuItem } from "../interfaces";

import { data } from "../services/testdata";

describe("The Sam MenuItem component", () => {
  const dummyMenuItem: MenuItem = { label: "dummy" };

  describe("isolated tests", () => {
    let component: SamMenuItemComponent;
    let service: SidenavService;
    beforeEach(() => {
      service = new SidenavService();
      service.setModel(data);
      component = new SamMenuItemComponent(service);
    });

    it("should support updateUI on changes", () => {
      component.selection.subscribe((val) => {
        expect(val.label).toBe("stuff");
      });
      component.updateUI(0, new Event("custom"), undefined);
    });

    it("should emit on selecting children", () => {
      component.selection.subscribe((val) => {
        expect(val).toBe(dummyMenuItem);
      });
      component.emitSelectedChild(dummyMenuItem);
    });
    it("should show children", () => {
      const obj: MenuItem = { label: "empty" };
      expect(component.hasChildren(obj)).toBe(false);
      const obj2: MenuItem = {
        label: "one child",
        children: [{ label: "child" }],
      };
      expect(component.hasChildren(obj2)).toBe(true);
      const obj3: MenuItem = { label: "empty children", children: [] };
      expect(component.hasChildren(obj3)).toBe(false);
    });
  });
  describe("rendered tests", () => {
    let fixture: ComponentFixture<SamMenuItemComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamSidenavModule],
      });

      fixture = TestBed.createComponent(SamMenuItemComponent);
    });

    it("should compile", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
