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
    emailValid = true;
    passwordValid = true;
    userNameValid = true;

    units = [
        'Stake Unit #',
        'Ward Unit #'
    ]

    showLoading = false;
    accountCreated = false;
    registerCredentials = { email: '', password: '', ldsorgusername: '', platform: '', stakeunit: '', wardunit: '', areaunit: '', branchunit: '' };

    constructor(private http: Http, private af: AngularFire, private firebaseService: FirebaseService, public router: Router) {
        this.fireAuth = firebase.auth();
        this.userProfile = firebase.database().ref('users');
        //this.generateIdenticon("fBCNn1bJIGfInLcSvtUdeqhufk83");
    }

    hasFocus(label, txtBox) {
        document.getElementById(label).setAttribute("class", "input-has-focus");
        document.getElementById(label).style.color = "#3cb18a";
        document.getElementById(txtBox).style.borderBottomColor = "#e8e9eb";

        if (label === 'emaillabel') {
            this.emailValid = true;
        }
        else if (label === 'pwdlabel') {
            this.passwordValid = true;
        }
        else if (label === 'ldslabel') {
            this.userNameValid = true;
        }

    }

    lostFocus(t, e) {

        if (t === 'emaillabel') {
            if ((new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.adminUser.email) === false)) {
                this.emailValid = false;
            }
            this.setStyles(t, e, this.emailValid);
        }
        else if (t === 'pwdlabel') {
            if ((<HTMLInputElement>document.getElementById(e)).value.length < 6) {
                this.passwordValid = false;
            }
            this.setStyles(t, e, this.passwordValid);
        }
        else if (t === 'ldslabel') {
            if (0 === (<HTMLInputElement>document.getElementById(e)).value.length) {
                this.userNameValid = false;
            }
            this.setStyles(t, e, this.userNameValid);
        }

    }

    setStyles(t, e, isValid) {
        if (isValid) {
            this.hasFocus(t, e);
        }
        else {
            document.getElementById(t).setAttribute("class", "input-has-error");
            document.getElementById(e).style.borderBottomColor = "#F13822";
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
                            'Area Presidency',
                            'President'
                        ];
                    }
                    else if (this.adminUser.unittype === 'Stake') {
                        councils = [
                            'Stake Presidency',
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
                            'Bishopric',
                            'Ward Council',
                            'PEC',
                            'High Priests',
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
                        var councilKey;

                        councils.forEach((council, index) => {
                            this.firebaseService.setDefaultCouncilsForAdmin(council, this.adminUser.unittype, this.adminUser.unitnumber).then(res => {

                                if (this.adminUser.unittype === 'Area' && council === 'President') {
                                    councilKey = res;
                                }
                                else if (this.adminUser.unittype === 'Stake' && council === 'Bishop') {
                                    councilKey = res;
                                }

                                ids.push(res);

                                if (councils.length === index + 1) {
                                    // This is for Stake admin sign up, and need to get data from Area admin and set it in Stake admin before creating Stake admin
                                    if (this.adminUser.unittype === 'Stake') {
                                        this.firebaseService.getAdminData(this.adminUser.unitnumber).then((res) => {
                                            res.forEach(ldsUnit => {
                                                var parentNum = ldsUnit.val().ParentNum;
                                                this.firebaseService.getUserByUnitNum(parentNum).then((res) => {
                                                    if (res) {
                                                        res.forEach(usr => {
                                                            if (usr.val().isadmin === true) {
                                                                this.firebaseService.getCouncilByUnitNum(parentNum, 'President_').then((res) => {
                                                                    res.forEach(cncl => {
                                                                        ids.push(cncl.key);
                                                                    });
                                                                    this.signupAdmin(councilKey, ids);
                                                                });
                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        this.signupAdmin(councilKey, ids);
                                                    }
                                                });
                                            });
                                        });
                                    }
                                    // This is for Ward admin sign up, and need to get data from Stake admin and set it in Ward admin before creating Ward admin
                                    else if (this.adminUser.unittype === 'Ward') {
                                        this.firebaseService.getAdminData(this.adminUser.unitnumber).then((res) => {
                                            res.forEach(ldsUnit => {
                                                var parentNum = ldsUnit.val().ParentNum;
                                                this.firebaseService.getUserByUnitNum(parentNum).then((res) => {
                                                    if (res) {
                                                        res.forEach(usr => {
                                                            if (usr.val().isadmin === true) {
                                                                this.firebaseService.getCouncilByUnitNum(parentNum, 'Bishop_').then((res) => {
                                                                    res.forEach(cncl => {
                                                                        ids.push(cncl.key);
                                                                    });
                                                                    this.signupAdmin(councilKey, ids);
                                                                });
                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        this.signupAdmin(councilKey, ids);
                                                    }
                                                });
                                            });
                                        });
                                    }
                                    else {
                                        this.signupAdmin(councilKey, ids);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        })
    }

    signupAdmin(councilKey, ids) {
        this.adminUser.councils = ids;
        var userAvatar = this.generateIdenticon();

        // sign up user logic goes here...
        this.firebaseService.signupNewUser(this.adminUser, userAvatar).then(res => {
            // alert("User is created...");

            this.http.post("https://councilsapi-165009.appspot.com/sendmail", {
                "event": "admincreated", "email": this.adminUser.email, "firstname": this.adminUser.firstname, "lastname": this.adminUser.lastname, "unitnum": this.adminUser.unitnumber,
            }).subscribe((res) => { console.log("Mail sent") });
            this.showLoading = false;
            this.accountCreated = true;
            //this.router.navigate(['./signup']);

            if (this.adminUser.unittype === 'Area') {
                this.firebaseService.setAreaAdminDataInStakeAdmins(this.adminUser.unitnumber, councilKey);
            }
            else if (this.adminUser.unittype === 'Stake') {
                this.firebaseService.setStakeAdminDataInWardAdmins(this.adminUser.unitnumber, councilKey);
            }
        }).catch(err => {
            alert(err);
        });
    }

    generateIdenticon() {
        var el = jazzicon(100, Math.round(Math.random() * 10000000000));
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

