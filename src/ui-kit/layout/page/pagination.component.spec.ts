import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { } from '../../';
import { SamPageComponent } from './page.component';
import { SamExperimentalModule } from '../../../ui-kit/experimental/experimental.module';

describe('SamPageComponent', () => {
  let component: SamPageComponent;
  let fixture: ComponentFixture<SamPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamPageComponent],
      imports: [FormsModule,SamExperimentalModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });


  it('intro', () => {


    component.intro ="test into";
  

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.intro'));
    expect(el.nativeElement.innerHTML).toContain('test into');


  });

});
