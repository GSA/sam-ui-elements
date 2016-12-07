// Angular Imports
import {
    inject,
    TestBed
} from '@angular/core/testing';
import { FormsModule } from "@angular/forms";

// SAM Imports
import { SamAngularDemo } from './sam-angular-demo.component';
import { SamAngularModule } from "../../sam-angular/sam-angular.module";

describe('Sam Angular Demo page', () => {
    // provide our implementations or mocks to the dependency injector
    let component: SamAngularDemo;
    let fixture: any;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SamAngularDemo],
            imports: [SamAngularModule, FormsModule],
            declarations: [SamAngularDemo]
        });
        fixture = TestBed.createComponent(SamAngularDemo);
        component = fixture.componentInstance;
    });

    it('should compile without error', () => {
        expect(true).toEqual(true);
    });



});
