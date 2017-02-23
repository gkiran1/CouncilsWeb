import { Component } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { Headers, Http, Response } from '@angular/http';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2/';
import { firebaseConfig } from '../environments/firebase';
import { FirebaseService } from '../../src/firebase/firebase-service';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { LoginComponent } from './Login.component'
import { emailComponent } from './Email.component';
import { signupComponent } from './signup.component';
import { unitmissingComponent } from './Unitmissing.component';
import { unitadministratorComponent } from './Unitadministrator.component';

// import {validate,Validator,Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

@Component({
  selector: 'app-root',
  templateUrl: 'register.html',
  styleUrls: ['./register.css'],
  providers: [FirebaseService]
})

export class RegisterPageComponent {
  adminUser: User = new User();

  public fireAuth: any;
  public userProfile: any;
  units = [
    'Stake Unit #',
    'Ward Unit #'
  ]

  registerCredentials = { email: '', password: '', ldsorgusername: '', platform: '', stakeunit: '', wardunit: '', areaunit: '', branchunit: '' };

  constructor(private http: Http, private af: AngularFire, private firebaseService: FirebaseService, public router: Router) {
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

  public registerAdmin() {
    this.adminUser.firstname = 'First Name';
    this.adminUser.lastname = 'Last Name';
    this.adminUser.calling = 'Calling';
    this.adminUser.avatar = 'Avatar';
    this.adminUser.isadmin = true;
    this.adminUser.createdby = '1212';
    this.adminUser.createddate = new Date().toDateString();
    this.adminUser.lastupdateddate = new Date().toDateString();
    this.adminUser.isactive = true;

    this.firebaseService.validateAdminSignup(this.adminUser).then(res => {
      if (res == 0) {
        alert('Email is not present in orgusers');
      }
      else if (res == 1) {
        this.router.navigate(['./Unitmissing']);
      }
      else if (res == 2) {
        alert('Email and Unitnumber are not associated');
      }
      else if (res == 3) {
        this.router.navigate(['./Unitadministrator']);
      }
      else if (res == 4) {
        alert('Duplicate ldsusername');
      }
      else if (res == 5) {

        this.firebaseService.getAdminCouncilsByUnitType(this.adminUser.unittype).then(res => {
          if (res != null) {
            this.adminUser.councils = res;
          }
          else {
            this.adminUser.councils = null;
          }

          // sign up user logic goes here...

          this.firebaseService.signupNewUser(this.adminUser).then(res => {
            alert("User is created...");
            this.router.navigate(['./signup']);
          }).catch(err => {
            alert(err);
          })

        }).catch(err => {
          alert(err);
        })
        
      }

    })

  }

  public register1() {

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

