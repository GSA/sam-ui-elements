/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamHeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';



fdescribe('SamHeaderComponent', () => {
  let component: SamHeaderComponent;
  let fixture: ComponentFixture<SamHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamHeaderComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHeaderComponent);
    component = fixture.componentInstance;
    component.model = {
      home: { text: "", id: "home", imageAltText: '', imageSourcePath: '', route: '', selected: false },
      navigationLinks:
        [{ text: "", selected: false, route: "", children: [], id: "navLink" }],
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



});

