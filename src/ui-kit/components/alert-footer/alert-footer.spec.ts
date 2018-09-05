import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {  By  } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamAlertFooterComponent, SamAlertFooterService } from './index';
import { SamAlertComponent } from '../alert/alert.component';

describe('The AlertFooter component', () => {
  describe('isolated tests', () => {
    let component: SamAlertFooterComponent;
    let service: SamAlertFooterService;
    beforeEach(() => {
      service = new SamAlertFooterService();
      component = new SamAlertFooterComponent(service);
      service.registerFooterAlert({
        description: 'hello',
        title: 'alert title',
        type: "success",
        timer: 0
      });
      service.registerFooterAlert({
        description: 'hello 2',
        title: 'alert title 2',
        type: "success",
        timer: 0
      });
    });

    // service
    it('set and get alerts', () => {
      const alerts = service.getAlerts();
      const expectedNumAlerts = 2;
      expect(alerts.length).toBe(expectedNumAlerts);
      expect(alerts[1].description).toBe('hello');
    });

    it('should dismiss alert by index', () => {
      const expectedNumAlerts = 2;
      const alertIndex = 2;
      service.dismissFooterAlert(alertIndex);
      let alerts = service.getAlerts();
      expect(alerts.length).toBe(expectedNumAlerts);
      service.dismissFooterAlert(0);
      alerts = service.getAlerts();
      expect(alerts.length).toBe(1);
    });
  });
  describe('rendered tests', () => {
    let component: SamAlertFooterComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ SamAlertFooterComponent, SamAlertComponent ],
        imports: [ ],
        providers: [ SamAlertFooterService ]
      });

      fixture = TestBed.createComponent(SamAlertFooterComponent);
      component = fixture.componentInstance;
    });


    it('should show 1 alert',
      inject([SamAlertFooterService], (alertFooterService) => {
      fixture.detectChanges();
      alertFooterService.registerFooterAlert({
        description: 'test',
        timer: 0,
        title: 'test',
        type: 'success',
      });
      component.refreshAlerts();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelectorAll('sam-alert').length
      )
      .toBe(1);
    }));
  });
});
