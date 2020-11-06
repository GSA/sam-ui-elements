import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Component, Output, ViewChild, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamDragDropDirective } from './drag-drop.directive';

@Component({
  selector: 'test-cmp',
  template: `
    <div #var sam-drag-drop (dragStateChange)="stateChange()" (dropEvent)="dropHandler()">
        <span #dummydrop>dummy</span>
    </div>
  ` 
})
class TestComponent {
    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('var', {static: true}) var;
    @ViewChild('dummydrop', {static: true}) dummydrop;
    dropHandler() {
      this.action.emit(true);
    }
    stateChange() {
      this.action.emit(true);
    }
}
describe('The Sam Focus directive', () => {
  let directive: SamDragDropDirective;
  let component: TestComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamDragDropDirective,
        TestComponent
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive =
      fixture.debugElement
      .query(
        By.directive(SamDragDropDirective)
      )
      .injector.get(SamDragDropDirective);
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should emit drag+drop event', () => {
    component.action.subscribe(val => {
      expect(val).toBe(true);
    });
    directive.onWindowDrop(<any>{
        preventDefault: function(){},
        stopPropagation: function(){},
        dataTransfer: {
            files: ['test.jpg']
        },
        target: component.dummydrop.nativeElement
    });
  });
  it('should emit dragover event', () => {
    component.action.subscribe(val => {
      expect(val).toBe(true);
    });

    directive.onWindowDragover(<any>{
        preventDefault: function(){},
        stopPropagation: function(){},
        dataTransfer: {
            files: ['test.jpg'],
        },
        target: component.dummydrop.nativeElement
    });
    
    directive.onElementDragend(<any>{
        preventDefault: function(){},
        stopPropagation: function(){},
        dataTransfer: {
            files: ['test.jpg'],
        },
        target: component.dummydrop.nativeElement
    });
  });
});
