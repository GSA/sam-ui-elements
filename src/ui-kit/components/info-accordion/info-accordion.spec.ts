import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { SamInfoAccordionComponent } from "./info-accordion.component";

describe('SAM Info Accordion Component', () => {
  let component:SamInfoAccordionComponent;
  let fixture:any;
  let dataConfig:any;


  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    dataConfig = [
      {
        title:"Federal Acquisition Regulation",
        detail:"Details for Federal Acquisition Regulation: ",
        link:"View FAR",
        url:"https://www.acquisition.gov/?q=browsefar",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"SBA Commercial Market Representative",
        detail:"Details for SBA Commercial Market Representative: ",
        link:"View SBA CMR",
        url:"https://www.sba.gov/contracting/resources-small-businesses/commercial-market-representatives",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Request DUNS Number",
        detail:"Details for Request DUNS Number: ",
        link:"View DUNS Number",
        url:"http://fedgov.dnb.com/webform",
        img:"src/assets/img/placeholder.jpg"
      }
    ];

    TestBed.configureTestingModule({
      declarations: [SamInfoAccordionComponent],
      imports: [RouterTestingModule]

    });
    fixture = TestBed.createComponent(SamInfoAccordionComponent);
    component = fixture.componentInstance;
    component.data = dataConfig;
    component.name = "contract";
  });

  it('should open detail when clicking on icon', done => {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelectorAll('.fa-plus')[2].click();
    fixture.whenStable().then(() =>{
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(component.data[0][2].detail);
      expect(component.detailObj.showDetail).toBe(true);
      done();
    }).catch(e => {done.fail(e)});
  });

  it('should open detail when clicking on link', done => {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelector('#contract-02-link').click();
    fixture.whenStable().then(() => {
      
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(component.data[0][2].detail);
      expect(component.detailObj.showDetail).toBe(true);
      done();
    }).catch(e => {done.fail(e)});
  });

  it('should open detail when clicking on semi-transparent div', ()=> {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelectorAll('.sam-info-accordion-layers')[2].click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(component.data[0][2].detail);
      expect(component.detailObj.showDetail).toBe(true);
    });
  });

  it('should hide detail when clicking on the same icon while the corresponding detail is open', done => {
    fixture.detectChanges();
    component.detailObj.showDetail = true;
    component.detailObj.posX = 0;
    component.detailObj.posY = 2;
    component.detailObj.item = component.data[0][2];

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(component.data[0][2].detail);
      fixture.nativeElement.querySelector('#contract-02-icon').click();

      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
      done();
    }).catch(e => {done.fail(e)});
  });

  it('should hide detail when clicking on the close link while the corresponding detail is open', done => {
    fixture.detectChanges();
    component.detailObj.showDetail = true;
    component.detailObj.posX = 0;
    component.detailObj.posY = 2;
    component.detailObj.item = component.data[0][2];

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".detail-text"));
      expect(contractDetail.nativeElement.innerHTML).toBe(component.data[0][2].detail);
      fixture.nativeElement.querySelector('.sam-info-accordion-library-close').click();

      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
      done();
    }).catch(e => {done.fail(e)});
  });
});
