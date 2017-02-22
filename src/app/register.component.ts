import { Component } from '@angular/core';
import { AngularFire,  FirebaseApp } from 'angularfire2';
import { Headers, Http, Response } from '@angular/http';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2/';
import { firebaseConfig } from '../environments/firebase';
// import {validate,Validator,Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

@Component({
  selector: 'app-root',
  templateUrl: 'register.html',
  styleUrls: ['./register.css']
})

export class RegisterPageComponent {
  public fireAuth: any;
  public userProfile: any;
    units = [
    'Stake Unit #',
    'Ward Unit #'
  ]

  registerCredentials = { email: '', password: '', ldsorgusername: '', platform: '', stakeunit: '',wardunit:'',areaunit:'',branchunit:''};

  constructor(private http: Http, private af: AngularFire) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users');
  }

  // create() {
  //   // this.nav.push(DisplayPage, this.registerCredentials);
  // }
  signUpUser(registerCredentials: any): any {
    this.fireAuth.createUserWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then((newUser) => {
      // Sign in the user.
      this.fireAuth.signInWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then((authenticatedUser) => {

        // Successful login, create user profile.
        this.userProfile.child(authenticatedUser.uid).set({
          email: registerCredentials.email,
          password: registerCredentials.password,
          username: registerCredentials.ldsorgusername,
          platform: registerCredentials.platform,
          stakeunit: registerCredentials.stakeunit,
          wardunit: registerCredentials.wardunit

        });
      });
      // return newUser;
    });
    console.log(registerCredentials);
  }
  public register() {

    this.signUpUser(this.registerCredentials);

    //  this.showLoading()
    //     this.auth.register(this.registerCredentials).subscribe(allowed => {
    //       if (allowed) {
    //         setTimeout(() => {
    //         this.loading.dismiss();
    //         this.nav.setRoot(DisplayPage)
    //         });
    //       }
    //     },
    //     // error => {
    //     //   this.showError(error);
    //     // }
    //     );
  }
  // showLoading() {
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Please wait...'
  //   });
  //   this.loading.present();
  // }

  // showError(text) {
  //   setTimeout(() => {
  //     this.loading.dismiss();
  //   });

  //   let alert = this.alertCtrl.create({
  //     title: 'Fail',
  //     subTitle: text,
  //     buttons: ['OK']
  //   });
  //   alert.present(prompt);
  // }


  //   this.auth.register(this.registerCredentials).subscribe(success => {
  //     if (success) {
  //       this.createSuccess = true;
  //         this.showPopup("Success", "Account created.");
  //     } else {
  //       this.showPopup("Error", "Problem creating account.");
  //     }
  //   },
  //   error => {
  //     this.showPopup("Error", error);
  //   });
  //   this.signUpUser(this.registerCredentials);
  // }

  // showPopup(title, text) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     subTitle: text,
  //     buttons: [
  //      {
  //        text: 'OK',
  //        handler: data => {
  //          if (this.createSuccess) {
  //            this.nav.popToRoot();
  //          }
  //        }
  //      }
  //    ]
  //   });
  //   alert.present();
  // }


}

