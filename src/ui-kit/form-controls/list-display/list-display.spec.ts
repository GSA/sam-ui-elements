// import { TestBed } from '@angular/core/testing';
// import { SamListDisplayComponent } from './list-display.component';
// import { SamAutocompleteModule } from '../autocomplete';
// import { FormsModule } from "@angular/forms";
// import { By } from "@angular/platform-browser";

// describe('The Sam List Display component', () => {
//   let component: SamListDisplayComponent;
//   let fixture: any;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         FormsModule
//       ],
//       declarations: [
//         SamListDisplayComponent,
//       ],
//     })

//     fixture = TestBed.createComponent(SamListDisplayComponent);
//     component.value = [];
//     component = fixture.componentInstance;
//     component.newValue = "Hello";
//   });

//   it('Should display newValue', () => {
//     fixture.detectChanges();
//     expect(fixture.debugElement.query(By.css('.usa-unstyled-list'))).toContain('Hello');
//   });

//   it('Should remove list item', () => {
//     component.removeItem(0);
//     fixture.detectChanges();
//     expect(fixture.debugElement.query(By.css('.usa-unstyled-list'))).not.toContain('Hello');
//   });

// });