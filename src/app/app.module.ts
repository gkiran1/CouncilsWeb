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
import { routing } from './app.routing';
const appRoutes: Routes = [
{path: '', component: RegisterPageComponent},
{ path: 'signup', component: signupComponent },
];
@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule,  RouterModule.forRoot(appRoutes) ,AngularFireModule.initializeApp(firebaseConfig)],
  declarations: [AppComponent, AboutusComponent,LoginComponent, RegisterPageComponent,signupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
