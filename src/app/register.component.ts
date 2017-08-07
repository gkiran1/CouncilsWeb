import { Component } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
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
import { NgForm } from '@angular/forms';


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
    firstNameValid = true;
    lastNameValid = true;
    firstNameMsg;
    lastNameMsg;

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
        else if (label === 'ldsfn') {
            this.firstNameValid = true;
        }
        else if (label === 'ldsln') {
            this.lastNameValid = true;
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
        else if (t === 'ldsfn') {
            if (0 === (<HTMLInputElement>document.getElementById(e)).value.length) {
                this.firstNameValid = false;
                this.firstNameMsg = 'First Name is required';
            }
            else if (!(new RegExp(/^[a-zA-Z].*/).test(this.adminUser.firstname))) {
                this.firstNameValid = false;
                this.firstNameMsg = 'First Name should start with alphabet';
            }
            this.setStyles(t, e, this.firstNameValid);
        }
        else if (t === 'ldsln') {
            if (0 === (<HTMLInputElement>document.getElementById(e)).value.length) {
                this.lastNameValid = false;
                this.lastNameMsg = 'Last Name is required';
            }
            else if (!(new RegExp(/^[a-zA-Z].*/).test(this.adminUser.lastname))) {
                this.lastNameValid = false;
                this.lastNameMsg = 'Last Name should start with alphabet';
            }
            this.setStyles(t, e, this.lastNameValid);
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


    public registerAdmin(form: NgForm) {
        this.showLoading = true;
        var under;

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
                var councils = [];

                if (this.adminUser.unittype === 'Area') {
                    councils = [
                        'Area Presidency',
                        'Stake Presidents'
                    ];
                    under = 'Area';
                }
                else if (this.adminUser.unittype === 'Stake') {
                    councils = [
                        'Stake Presidency',
                        'High Council',
                        'Bishops',
                        'Relief Society',
                        'Young Men',
                        'Young Women',
                        'Sunday School',
                        'Primary',
                        'Missionary'
                    ];
                    under = 'Stake';
                }
                else if (this.adminUser.unittype === 'Ward') {
                    councils = [
                        'Bishopric',
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
                    under = 'Ward';
                }

                if (councils) {
                    var ids = [];
                    var councilKey;

                    councils.forEach((council, index) => {
                        this.firebaseService.setDefaultCouncilsForAdmin(council, this.adminUser.unittype, this.adminUser.unitnumber, under).then(res => {

                            if (this.adminUser.unittype === 'Area' && council === 'Stake Presidents') {
                                councilKey = res;
                            }
                            else if (this.adminUser.unittype === 'Stake' && council === 'Bishops') {
                                councilKey = res;
                            }

                            ids.push(res);

                            if (councils.length === index + 1) {
                                // This is for Stake admin sign up, and need to get data from Area admin and set it in Stake admin before creating Stake admin
                                if (this.adminUser.unittype === 'Stake') {
                                    this.firebaseService.getAdminData(this.adminUser.unitnumber).then((res) => {
                                        if (res) {
                                            res.forEach(ldsUnit => {
                                                var parentNum = ldsUnit.val().ParentNum;
                                                this.firebaseService.getUserByUnitNum(parentNum).then((res) => {
                                                    if (res) {
                                                        res.forEach(usr => {
                                                            if (usr.val().isadmin === true) {
                                                                this.firebaseService.getCouncilByUnitNum(parentNum, 'Stake Presidents_').then((res) => {
                                                                    res.forEach(cncl => {
                                                                        ids.push(cncl.key);
                                                                    });
                                                                    this.signupAdmin(councilKey, ids, form);
                                                                });
                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        this.signupAdmin(councilKey, ids, form);
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            this.signupAdmin(councilKey, ids, form);
                                        }
                                    });
                                }
                                // This is for Ward admin sign up, and need to get data from Stake admin and set it in Ward admin before creating Ward admin
                                else if (this.adminUser.unittype === 'Ward') {
                                    this.firebaseService.getAdminData(this.adminUser.unitnumber).then((res) => {
                                        if (res) {
                                            res.forEach(ldsUnit => {
                                                var parentNum = ldsUnit.val().ParentNum;
                                                this.firebaseService.getUserByUnitNum(parentNum).then((res) => {
                                                    if (res) {
                                                        res.forEach(usr => {
                                                            if (usr.val().isadmin === true) {
                                                                this.firebaseService.getCouncilByUnitNum(parentNum, 'Bishops_').then((res) => {
                                                                    res.forEach(cncl => {
                                                                        ids.push(cncl.key);
                                                                    });
                                                                    this.signupAdmin(councilKey, ids, form);
                                                                });
                                                                return;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        this.signupAdmin(councilKey, ids, form);
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            this.signupAdmin(councilKey, ids, form);
                                        }
                                    });
                                }
                                else {
                                    this.signupAdmin(councilKey, ids, form);
                                }
                            }
                        });
                    });
                }

            }
        })
    }

    signupAdmin(councilKey, ids, form: NgForm) {
        this.adminUser.councils = ids;
        var userAvatar = this.generateIdenticon();

        var usrData = new User();

        usrData.firstname = this.adminUser.firstname;
        usrData.lastname = this.adminUser.lastname;
        usrData.email = this.adminUser.email;
        usrData.password = this.adminUser.password;
        usrData.ldsusername = this.adminUser.ldsusername;
        usrData.unittype = this.adminUser.unittype;
        usrData.unitnumber = this.adminUser.unitnumber;
        usrData.councils = this.adminUser.councils;
        usrData.calling = this.adminUser.calling;
        usrData.avatar = this.adminUser.avatar;
        usrData.isadmin = this.adminUser.isadmin;
        usrData.createdby = this.adminUser.createdby;
        usrData.createddate = this.adminUser.createddate;
        usrData.lastupdateddate = this.adminUser.lastupdateddate;
        usrData.isactive = this.adminUser.isactive;

        // sign up user logic goes here...
        this.firebaseService.signupNewUser(usrData, userAvatar).then(fbAuthToken => {
            console.log('fbAuthToken --- ' + fbAuthToken);
            var uid = localStorage.getItem('createdUsrId');
            // alert("User is created...");

            this.firebaseService.setDefaultNotificationSettings(uid).then(() => { console.log('Default settings for push notifications is done.') });

            let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': fbAuthToken, 'x-key': uid });
            let options = new RequestOptions({ headers: headers });

            this.http.post("https://councilsapi-165009.appspot.com/v1/sendmail", {
                "event": "admincreated", "email": usrData.email, "firstname": usrData.firstname, "lastname": usrData.lastname, "unitnum": usrData.unitnumber,
            }, options).subscribe((res) => { console.log("Mail sent") });

        }).then((res) => {

            if (usrData.unittype === 'Area') {
                this.firebaseService.setAreaAdminDataInStakeAdmins(usrData.unitnumber, councilKey);
            }
            else if (usrData.unittype === 'Stake') {
                this.firebaseService.setStakeAdminDataInWardAdmins(usrData.unitnumber, councilKey);
            }

            this.showLoading = false;
            this.accountCreated = true;
            //this.router.navigate(['./signup']);
            form.resetForm();

            document.getElementById('ldsfn').removeAttribute("class");
            document.getElementById('ldsfn').style.color = "#A9AAAC";

            document.getElementById('ldsln').removeAttribute("class");
            document.getElementById('ldsln').style.color = "#A9AAAC";

            document.getElementById('emaillabel').removeAttribute("class");
            document.getElementById('emaillabel').style.color = "#A9AAAC";

            document.getElementById('pwdlabel').removeAttribute("class");
            document.getElementById('pwdlabel').style.color = "#A9AAAC";

            document.getElementById('ldslabel').removeAttribute("class");
            document.getElementById('ldslabel').style.color = "#A9AAAC";

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

