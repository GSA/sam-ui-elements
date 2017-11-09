import { TestBed,inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {  By  } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamAlertFooterComponent } from './index';
import { SamAlertComponent } from '../alert/alert.component';
import { SamAlertFooterService } from './index';


describe('The AlertFooter component', () => {
  describe('isolated tests', ()=>{
    let component: SamAlertFooterComponent;
    let service: SamAlertFooterService;
    beforeEach(() => {
      service = new SamAlertFooterService();
      component = new SamAlertFooterComponent(service);
      service.registerFooterAlert({
        title: 'alert title',
        description: 'hello'
      });
      service.registerFooterAlert({
        title: 'alert title 2',
        description: 'hello 2'
      });
    });

    //service
    it('set and get alerts',()=>{
      let alerts = service.getAlerts();
      expect(alerts.length).toBe(2);
      expect(alerts[1].description).toBe('hello');
    });

    it('should dismiss alert by index', ()=>{
      service.dismissFooterAlert(2)
      let alerts = service.getAlerts(); 
      expect(alerts.length).toBe(2);
      service.dismissFooterAlert(0);
      alerts = service.getAlerts(); 
      expect(alerts.length).toBe(1);
    });
  });
  describe('rendered tests', ()=>{
    let component: SamAlertFooterComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ SamAlertFooterComponent,SamAlertComponent ],
        imports: [ ],
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
});
