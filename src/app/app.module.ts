import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutusComponent } from './Aboutus.component';
import { firebaseConfig } from '../firebase/firebase-config';
import { AngularFireModule } from 'angularfire2';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './Login.component';
import { RegisterPageComponent } from './register.component';
import { RouterModule, Routes } from '@angular/router';
import { signupComponent } from './signup.component';
import { emailComponent } from './Email.component';
import { UnitmissingComponent } from './Unitmissing.component';
import { unitadministratorComponent } from './Unitadministrator.component';
import { unitnoandtypenotassocComponent } from './UnitNoAndTypeNotAsso.component';
import { ValidateOnBlurDirective } from '../directives/validate-onblur';
//import { routing } from './app.routing';
import { Test } from './directive';

const appRoutes: Routes = [
  { path: '', component: RegisterPageComponent },
  { path: 'signup', component: signupComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'AboutUs', component: AboutusComponent },
  { path: 'Unitmissing/:id', component: UnitmissingComponent },
  { path: 'Unitadministrator/:id', component: unitadministratorComponent },
  { path: 'UnitNoAndTypeNotAsso', component: unitnoandtypenotassocComponent },
  {
    path: 'Unitmissing/:id',
    children: [
      { path: 'register', component: RegisterPageComponent },
      { path: 'email', component: emailComponent }
    ]
  },
  {
    path: 'Unitmissing/:id/email',
    children: [
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: 'Unitadministrator/:id',
    children: [
      { path: 'register', component: RegisterPageComponent },
      { path: 'email', component: emailComponent }
    ]
  },
  {
    path: 'Unitadministrator/:id/email',
    children: [
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: 'UnitNoAndTypeNotAsso',
    children: [
      { path: 'register', component: RegisterPageComponent }
    ]
  },
];

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes), RouterModule.forChild(appRoutes), AngularFireModule.initializeApp(firebaseConfig)],
  declarations: [AppComponent, AboutusComponent, LoginComponent, RegisterPageComponent, ValidateOnBlurDirective, signupComponent, emailComponent, UnitmissingComponent, unitadministratorComponent, Test, unitnoandtypenotassocComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }
