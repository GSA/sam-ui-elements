import { Routes } from '@angular/router';
import { Home } from './home';
import { NoContent } from './common/no-content';
import { SamAngularDemo } from './sam-angular-demo';

export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'sam-angular', component: SamAngularDemo },
  { path: '**',    component: NoContent },
];
