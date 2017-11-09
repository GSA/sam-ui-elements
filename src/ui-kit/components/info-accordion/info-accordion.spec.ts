import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        content:"Details for Federal Acquisition Regulation: ",
        link:"View FAR",
        url:"https://www.acquisition.gov/?q=browsefar",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"SBA Commercial Market Representative",
        content:"Details for SBA Commercial Market Representative: ",
        link:"View SBA CMR",
        url:"https://www.sba.gov/contracting/resources-small-businesses/commercial-market-representatives",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Request DUNS Number",
        content:"Details for Request DUNS Number: ",
        link:"View DUNS Number",
        url:"http://fedgov.dnb.com/webform",
        img:"src/assets/img/placeholder.jpg"
      }
    ];

    TestBed.configureTestingModule({
      declarations: [SamInfoAccordionComponent],
      imports: [RouterTestingModule,BrowserAnimationsModule]

    });
    fixture = TestBed.createComponent(SamInfoAccordionComponent);
    component = fixture.componentInstance;
    component.data = dataConfig;
    component.name = "contract";
    component.ngOnInit();
  });

  it('should open detail when clicking on icon', done => {
    fixture.detectChanges();
    expect(component.detailObj.showDetail).toBe(false);
    fixture.nativeElement.querySelectorAll('.fa-plus')[2].click();
    fixture.whenStable().then(() =>{
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".sam-ui.clearing.padded.segment"));
      expect(contractDetail.nativeElement.innerHTML).toContain(component.data[0][2].content);
      expect(component.detailObj.showDetail).toBe(true);
      done();
    }).catch(e => {done.fail(e)});
  });

  it('should hide detail when clicking on the same icon while the corresponding detail is open', done => {
    component.detailObj.showDetail = true;
    component.detailObj.posX = 0;
    component.detailObj.posY = 2;
    component.detailObj.item = component.data[0][2];
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let contractDetail = fixture.debugElement.query(By.css(".sam-ui.clearing.padded.segment"));
      expect(contractDetail.nativeElement.innerHTML).toContain(component.data[0][2].content);
      fixture.nativeElement.querySelectorAll('.fa-plus')[2].click();

      fixture.detectChanges();
      expect(component.detailObj.showDetail).toBe(false);
      done();
    }).catch(e => {done.fail(e)});
  });
});
