// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { By } from '@angular/platform-browser';
// import { SimpleChanges } from '@angular/core';
// import { SamIconsModule } from '../icon/icon.module';

// // Load the implementations that should be tested
// import { SamAlertNextComponent } from './alert.component';

// const defaultConfig = {
//   description: 'i-am-a-description',
//   title: 'i-am-a-title',
//   type: 'success',
// };

// xdescribe('The Sam Alert component', () => {
//   describe('isolated tests', () => {
//     let component: SamAlertNextComponent;
//     beforeEach(() => {
//       component = new SamAlertNextComponent();
//     });
//     it('should check if type is defined', () => {
//       component.type = 'notAValidType';
//       expect(component.typeNotDefined()).toBe(true);
//       component.type = 'success';
//       expect(component.typeNotDefined()).toBe(false);
//       component.ngOnInit();
//       expect(component.selectedType).toBe('sam-alert-success');
//     });
//   });
//   describe('rendered tests', () => {
//     let component: SamAlertNextComponent;
//     let fixture: any;

//     beforeEach(() => {
//       TestBed.configureTestingModule({
//         declarations: [SamAlertNextComponent],
//         imports: [RouterTestingModule, SamIconsModule],
//       });

//       fixture = TestBed.createComponent(SamAlertNextComponent);
//       component = fixture.componentInstance;
//       component.type = defaultConfig.type;
//       fixture.detectChanges();

//     });
//     it('type check', () => {
//       fixture.detectChanges();
//       fixture.whenStable().then(() => {
//         expect(
//           fixture.debugElement.query(
//             By.css('.sam-alert')
//           ).nativeElement.className
//         )
//         .toContain('sam-alert-success');
//       });
//     });
//   });
// });
