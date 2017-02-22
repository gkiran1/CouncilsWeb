import { LoginComponent } from './Login.component';
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { signupComponent }       from './signup.component';
import { RegisterPageComponent} from './register.component';
// import { AboutusComponent } from './Aboutus.component';

const appRoutes: Routes = [
{path: '', component: RegisterPageComponent},
{ path: 'signup', component: signupComponent }
// { path:'Aboutus', component:AboutusComponent}
];
export const routing = RouterModule.forRoot(appRoutes);
export class AppRoutingModule { }