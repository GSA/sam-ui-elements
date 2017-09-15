import { TestBed,inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {  By  } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamAlertFooterComponent } from './alert-footer.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAlertFooterService } from './alert-footer.service';


describe('The AlertFooter component', () => {
  let component: SamAlertFooterComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamAlertFooterComponent ],
      imports: [ SamUIKitModule ],
      providers: [ SamAlertFooterService ]
    });

    fixture = TestBed.createComponent(SamAlertFooterComponent);
    component = fixture.componentInstance;
  });


  it('should show 1 alert', inject([SamAlertFooterService],(alertFooterService) => {
    fixture.detectChanges();
    alertFooterService.registerFooterAlert({
      title:"test",
      description:"test",
      type:'success',
      timer:0
    });
    component.refreshAlerts();
    fixture.detectChanges();
    //console.log(fixture.nativeElement.querySelector("samalert"));
    expect(fixture.nativeElement.querySelectorAll("sam-alert").length).toBe(1);
  }));
});
