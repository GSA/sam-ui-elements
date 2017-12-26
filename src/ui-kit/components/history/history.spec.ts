import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SamHistoryComponent } from './history.component';

const historyCurrentId = '1a610c814d73fc23a6b71decc9b4c548';
const historyData = [
  {
    authoritative: '0',
    date: 'Feb 04, 2016 8:20am',
    description: 'Lorem Ipsum',
    id: '0564cc38f28e1a85ea66de2bb78dae29',
    index: '1',
    title: 'Original Combined Synopsis/Solicitation',
    url: '/opportunities/0564cc38f28e1a85ea66de2bb78dae29',
  },
  {
    authoritative: '1',
    date: 'Mar 13, 2016 1:21pm',
    description: '',
    id: '1a610c814d73fc23a6b71decc9b4c548',
    index: '2',
    title: 'Award Notice',
    url: '/opportunities/1a610c814d73fc23a6b71decc9b4c548',
  }
];


describe('The SAM History Component', () => {
  let component: SamHistoryComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SamHistoryComponent],
    });

    fixture = TestBed.createComponent(SamHistoryComponent);
    component = fixture.componentInstance;
    component.data = historyData;
    component.currentId = historyCurrentId;
  });

  it('check markup', () => {
    fixture.detectChanges();
    // Date
    expect(
      fixture.debugElement.query(
        By.css('ul li:nth-child(1) strong')
      )
      .nativeElement.innerHTML
    )
    .toBe('Feb 04, 2016 8:20am');
    // Title
    expect(
      fixture.debugElement.query(
        By.css('ul li:nth-child(1) a')
      )
      .nativeElement.innerHTML
    )
    .toBe('Original Combined Synopsis/Solicitation');
    // Description
    expect(
      fixture.debugElement.query(
        By.css('ul li:nth-child(1) p')
      )
      .nativeElement.innerHTML
    )
    .toBe('Lorem Ipsum');
    // URL
    expect(
      fixture.debugElement.query(
        By.css('ul li:nth-child(1) a')
      )
      .nativeElement.getAttribute('href')
    )
    .toBe('/opportunities/0564cc38f28e1a85ea66de2bb78dae29');
  });

  it('check current class', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(
        By.css('ul li:nth-child(2)')
      )
      .nativeElement.getAttribute('class')
    )
    .toContain('current');
  });
});
