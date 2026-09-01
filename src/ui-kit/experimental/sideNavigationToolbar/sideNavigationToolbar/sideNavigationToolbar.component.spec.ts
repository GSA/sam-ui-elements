import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SamSideNavigationToolbarComponent } from "./sideNavigationToolbar.component";
import { SamSideNavigationToolbarItemComponent } from "../sideNavigationToolbarItem/sideNavigationToolbarItem.component";
import { CommonModule } from "@angular/common";
import { Component, ViewChildren, QueryList } from "@angular/core";

@Component({
  template: `
    <sam-side-navigation-toolbar>
      <sam-side-navigation-toolbar-item
        *ngFor="let item of items"
        [id]="item.id"
        [title]="item.title"
      ></sam-side-navigation-toolbar-item>
    </sam-side-navigation-toolbar>
  `,
  standalone: false,
})
class HostComponent {
  items = [
    { id: "item1", title: "First" },
    { id: "item2", title: "Second" },
  ];

  @ViewChildren(SamSideNavigationToolbarItemComponent)
  toolbarItems: QueryList<SamSideNavigationToolbarItemComponent>;
}

describe("SamSideNavigationToolbarComponent", () => {
  let component: SamSideNavigationToolbarComponent;
  let fixture: ComponentFixture<SamSideNavigationToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamSideNavigationToolbarComponent,
        SamSideNavigationToolbarItemComponent,
      ],
      imports: [CommonModule],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamSideNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

describe("SamSideNavigationToolbarComponent accordion coordination", () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        SamSideNavigationToolbarComponent,
        SamSideNavigationToolbarItemComponent,
      ],
      imports: [CommonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it("should close all other items when one item is selected", () => {
    const [first, second] = host.toolbarItems.toArray();

    first.open();
    hostFixture.detectChanges();
    expect(first.showSection).toBe(true);
    expect(second.showSection).toBe(false);

    second.open();
    hostFixture.detectChanges();
    expect(first.showSection).toBe(false);
    expect(second.showSection).toBe(true);
  });
});
