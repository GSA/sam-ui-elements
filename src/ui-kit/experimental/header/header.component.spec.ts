/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamHeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';



describe('SamHeaderComponent', () => {
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove white space', () => {
    let before ='T E S T';
    let after ='TEST';
    expect(component.removeWhiteSpace(before)).toBe(after);
  });


 
});

