/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SdsHeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SdsTopBannerComponent } from './top-banner/top-banner.component';



describe('SdsHeaderComponent', () => {
  let component: SdsHeaderComponent;
  let fixture: ComponentFixture<SdsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SdsHeaderComponent, SdsTopBannerComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdsHeaderComponent);
    component = fixture.componentInstance;
    component.model = {
      home: { text: "", id: "home", imageAltText: '', imageSourcePath: '', route: '', selected: false },
      navigationLinks:
        [{ text: "", selected: false, route: "", children: [{ text: "", selected: false, route: "", children: [], id: "childLink" }], id: "navLink" }],
      secondaryLinks: [{ text: "", selected: false, route: "", id: "secNavLink", imageSourcePath: "", imageAltText: "" }]
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove white space', () => {
    let before = 'T E S T';
    let after = 'TEST';
    expect(component.removeWhiteSpace(before)).toBe(after);
  });

  it('find should be null when model is empty', () => {
    expect(component.find('')).toBe(null);
  });


  it('home find / select /deselect', () => {

    expect(component.find(component.model.home.id)).toBe(component.model.home);

    expect(component.model.home.selected).toBe(false);
    component.select(component.model.home.id);
    expect(component.model.home.selected).toBe(true);
    component.deselect();
    expect(component.model.home.selected).toBe(false);
  });


  it('navigation link find / select /deselect', () => {
    expect(component.find(component.model.navigationLinks[0].id)).toBe(component.model.navigationLinks[0]);
    component.select(component.model.navigationLinks[0].id);
    expect(component.model.navigationLinks[0].selected).toBe(true);
    component.deselect();
    expect(component.model.navigationLinks[0].selected).toBe(false);
  });

  it('secondary navigation link find / select /deselect', () => {
    expect(component.find(component.model.secondaryLinks[0].id)).toBe(component.model.secondaryLinks[0]);

    component.select(component.model.secondaryLinks[0].id);
    expect(component.model.secondaryLinks[0].selected).toBe(true);
    component.deselect();
    expect(component.model.secondaryLinks[0].selected).toBe(false);
  });

  it('navigation link child find / select /deselect', () => {
    expect(component.find(component.model.navigationLinks[0].children[0].id)).toBe(component.model.navigationLinks[0].children[0]);
    component.select(component.model.navigationLinks[0].children[0].id);
    expect(component.model.navigationLinks[0].children[0].selected).toBe(true);
    component.deselect();
    expect(component.model.navigationLinks[0].children[0].selected).toBe(false);
  });





});

