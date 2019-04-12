/* tslint:disable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SamTopBannerComponent } from './top-banner.component';



describe('SamTopBannerComponent', () => {
  let component: SamTopBannerComponent;
  let fixture: ComponentFixture<SamTopBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamTopBannerComponent],
      imports: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamTopBannerComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

