import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { } from '../../';
import { SamPageComponent } from './page.component';

import { SamTitleModule } from '../../../ui-kit/experimental/title/title.module';

fdescribe('SamPageComponent', () => {
  let component: SamPageComponent;
  let fixture: ComponentFixture<SamPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamPageComponent],
      imports: [FormsModule,SamTitleModule]
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

});
