import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AboutUs } from './About';
import { FirebaseService } from '../../src/firebase/firebase-service';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { Observable } from "rxjs/Rx";



@Component({
  selector: 'about-uss',
  templateUrl: './AboutUs.html',
  styleUrls: ['./Aboutus.css'],
  providers: [FirebaseService]
})
export class AboutusComponent {
  about: AboutUs;

  constructor(private firebaseService: FirebaseService) {
    this.about = new AboutUs();

  }

  Save(event: any) {
     this.about.createddate=((new Date()).toString()).slice(0, 16)
    this.firebaseService.createAboutUs(this.about);
  }

}