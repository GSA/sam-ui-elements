import { Routes } from '@angular/router';
import { NoContent } from './common/no-content';
import { SamAngularDemo } from './sam-angular-demo';

export const ROUTES: Routes = [
  { path: '',  component: SamAngularDemo },
  { path: 'sam-angular', component: SamAngularDemo },
  { path: '**',    component: NoContent },
];
