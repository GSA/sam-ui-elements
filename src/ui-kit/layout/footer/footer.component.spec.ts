/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamFooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';



describe('SamFooterComponent', () => {
  let component: SamFooterComponent;
  let fixture: ComponentFixture<SamFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamFooterComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamFooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

