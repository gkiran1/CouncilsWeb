import { Component } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { Headers, Http, Response } from '@angular/http';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2/';
import { FirebaseService } from '../../src/firebase/firebase-service';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { LoginComponent } from './Login.component'
import { emailComponent } from './Email.component';
import { signupComponent } from './signup.component';
import { UnitmissingComponent } from './Unitmissing.component';
import { unitadministratorComponent } from './Unitadministrator.component';
import * as jazzicon from 'jazzicon';


// import {validate,Validator,Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

@Component({
    selector: 'app-root',
    templateUrl: 'register.html',
    styleUrls: ['./register.css'],
    providers: [FirebaseService]
})

export class RegisterPageComponent {
    adminUser: User = new User();
    userid: string;
    public fireAuth: any;
    public userProfile: any;
    units = [
        'Stake Unit #',
        'Ward Unit #'
    ]

    showLoading = false;

    registerCredentials = { email: '', password: '', ldsorgusername: '', platform: '', stakeunit: '', wardunit: '', areaunit: '', branchunit: '' };

    constructor(private http: Http, private af: AngularFire, private firebaseService: FirebaseService, public router: Router) {
        this.fireAuth = firebase.auth();
        this.userProfile = firebase.database().ref('users');
        //this.generateIdenticon("fBCNn1bJIGfInLcSvtUdeqhufk83");
    }

    hasFocus(label) {
        document.getElementById(label).setAttribute("class", "input-has-focus");
        document.getElementById(label).style.color = "#3cb18a";
    }

    lostFocus(t, e) {
        if(0 === (<HTMLInputElement>document.getElementById(e)).value.length)
        { 
            document.getElementById(t).removeAttribute("class");
            document.getElementById(t).style.color = "#a9aaac";
        }
        else {
            this.hasFocus(t) 
        }
    }

    handleUserUpdated(user) {
        this.adminUser.unitnumber = user;
        console.log(user);
    }

    signUpUser(registerCredentials: any): any {
        this.fireAuth.createUserWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then((newUser) => {
            // Sign in the user.
            this.fireAuth.signInWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then((authenticatedUser) => {
                this.userid = authenticatedUser.uid;
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
        this.showLoading = true;
        this.firebaseService.validateAdminSignup(this.adminUser).then(res => {

            if (res == 1) {
                this.router.navigate(['./Unitmissing', this.adminUser.unitnumber]);
            }
            else if (res == 2) {
                localStorage.setItem('unitnum', this.adminUser.unitnumber.toString())
                //alert('UnitNumber and UnitType are not associated');
                this.router.navigate(['./UnitNoAndTypeNotAsso']);
            }
            else if (res == 3) {
                this.router.navigate(['./Unitadministrator', this.adminUser.unitnumber]);
            }
            else if (res == 4) {
                // Need to get other data like firstname, lastname and all from orgusers...
                this.firebaseService.getAdminDataFromOrgUsersByEmail(this.adminUser.email).then(res => {
                    res.forEach(user => {
                        this.adminUser.firstname = user.val().UserFirstName;
                        this.adminUser.lastname = user.val().UserLastName;
                        this.adminUser.calling = ''
                        this.adminUser.avatar = '';
                        this.adminUser.isadmin = true;  // Never change this...because this is Admin Sign Up.....
                        this.adminUser.createdby = ''
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
                                    var userAvatar = this.generateIdenticon();

                                    // sign up user logic goes here...
                                    this.firebaseService.signupNewUser(this.adminUser, userAvatar).then(res => {
                                        // alert("User is created...");

                                        this.http.post("https://councilsapi-165009.appspot.com/sendmail", {
                                            "event": "admincreated", "email": this.adminUser.email, "firstname": this.adminUser.firstname, "lastname": this.adminUser.lastname, "unitnum": this.adminUser.unitnumber,
                                        }).subscribe((res) => { console.log("Mail sent") });
                                        this.showLoading = false;
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

    generateIdenticon() {
        var el = jazzicon(100, Math.round(Math.random() * 10000000000))
        var svg = el.querySelector('svg');

        var s = new XMLSerializer().serializeToString(el.querySelector('svg'));
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var img = new Image();

        var base64 = window.btoa(s);
        img.src = 'data:image/svg+xml,' + base64;
        context.drawImage(img, 0, 0);
        return base64;
        //this.firebaseService.saveIdenticon(uid, base64 );


    }



}

