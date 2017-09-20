import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamModalComponent} from './modal.component';
import {SamElementsModule} from '../../elements';

describe('The Sam Modal component', () => {
  let component:SamModalComponent;
  let fixture:any;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[SamElementsModule],
      declarations: [SamModalComponent]
    });

    fixture = TestBed.createComponent(SamModalComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('default test', function () {


    component.title = "test title";
    component.type = "success";
    component.openModal();
    fixture.detectChanges();

    let el = fixture.debugElement.query(By.css(".usa-alert-heading"));
    expect(el.nativeElement.innerHTML).toContain("test title");


  });


});
