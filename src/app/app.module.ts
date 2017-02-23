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
import { unitmissingComponent } from './Unitmissing.component';
import { unitadministratorComponent } from './Unitadministrator.component';
import { routing } from './app.routing';
import { Test } from './directive';
const appRoutes: Routes = [
  { path: '', component: RegisterPageComponent },
  { path: 'signup', component: signupComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Email', component: emailComponent },
  { path: 'Unitmissing', component: unitmissingComponent },
  { path: 'Unitadministrator', component: unitadministratorComponent }
];
@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes), AngularFireModule.initializeApp(firebaseConfig)],
  declarations: [AppComponent, AboutusComponent, LoginComponent, RegisterPageComponent, signupComponent, emailComponent, unitmissingComponent, unitadministratorComponent,Test],
  bootstrap: [AppComponent]
})
export class AppModule { }
