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
import { MaterialModule } from '@angular/material';
//import { routing } from './app.routing';
import { Test } from './directive';

const appRoutes: Routes = [
  { path: '', component: RegisterPageComponent },
  { path: 'signup', component: signupComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'AboutUs', component: AboutusComponent },
  { path: 'Unitmissing', component: UnitmissingComponent },
  { path: 'Unitadministrator', component: unitadministratorComponent },
  {
    path: 'Unitmissing',
    children: [
      { path: '', component: RegisterPageComponent },
      { path: 'Email', component: emailComponent }
    ]
  },
  {
    path: 'Unitmissing/Email',
    children: [
      // {path : '' , component:RegisterPageComponent},
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: 'Unitadministrator',
    children: [
      { path: '', component: RegisterPageComponent },
      { path: 'Email', component: emailComponent }
    ]
  },
  {
    path: 'Unitadministrator/Email',
    children: [
      // {path : '' , component:RegisterPageComponent},
      { path: 'register', component: RegisterPageComponent }
    ]
  }
];
@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes), RouterModule.forChild(appRoutes), AngularFireModule.initializeApp(firebaseConfig),MaterialModule.forRoot()],
  declarations: [AppComponent, AboutusComponent, LoginComponent, RegisterPageComponent, signupComponent, emailComponent, UnitmissingComponent, unitadministratorComponent, Test],
  bootstrap: [AppComponent]
})
export class AppModule { }
