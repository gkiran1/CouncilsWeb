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
import { UnitmissingComponent } from './Unitmissing.component';
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

  handleUserUpdated(user) {
    this.adminUser.unitnumber = user;
    console.log(user);
  }

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
    this.firebaseService.validateAdminSignup(this.adminUser).then(res => {
      if (res == 0) {
        alert('Email does not Exist');
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
        // Need to get other data like firstname, lastname and all from orgusers...
        this.firebaseService.getAdminDataFromOrgUsers(this.adminUser.email).then(res => {
          res.forEach(user => {
            this.adminUser.firstname = user.val().firstname;
            this.adminUser.lastname = user.val().lastname;
            this.adminUser.calling = user.val().calling;
            this.adminUser.avatar = user.val().avatar;
            this.adminUser.isadmin = true;  // Never change this...because this is Admin Sign Up.....
            this.adminUser.createdby = user.val().createdby
            this.adminUser.createddate = new Date().toDateString();
            this.adminUser.lastupdateddate = new Date().toDateString();
            this.adminUser.isactive = true;
          });

          var councils = [];
          if (this.adminUser.unittype === 'Area') {
            councils = [
              'Elder',
              'President'
            ];
          }
          else if (this.adminUser.unittype === 'Stake') {
            councils = [
              'President',
              'High Council',
              'Bishop',
              'Relief Society',
              'Young Men',
              'Young Women',
              'Sunday School',
              'Primary',
              'Missionary'
            ];
          }
          else if (this.adminUser.unittype === 'Ward') {
            councils = [
              'Bishop',
              'Ward Council',
              'PEC',
              'High Priest',
              'Elders',
              'Relief Society',
              'Young Men',
              'Young Women',
              'Sunday School',
              'Primary',
              'Missionary'
            ];
          }

          if (councils) {
            var ids = [];
            councils.forEach((council, index) => {
              this.firebaseService.setDefaultCouncilsForAdmin(council, this.adminUser.unittype, this.adminUser.unitnumber).then(res => {
                ids.push(res);
                if (councils.length === index + 1) {
                  this.adminUser.councils = ids;
                  // sign up user logic goes here...
                  this.firebaseService.signupNewUser(this.adminUser).then(res => {
                    // alert("User is created...");
                    this.router.navigate(['./signup']);
                  }).catch(err => {
                    alert(err);
                  });
                }
              });
            });
          }
        });
      }
    })
  }

}

