import { Injectable } from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { Observable, Subject } from "rxjs/Rx";
import { AboutUs } from '../../src/app/About';
import { User } from '../user/user';

@Injectable()
export class FirebaseService {

    fireAuth = firebase.auth();

    rootRef = firebase.database().ref();



    constructor(private _http: Http, private af: AngularFire) {

    }

    createAboutUs(aboutus: AboutUs) {
        this.rootRef.child('aboutus').push({
            "softwareversion": aboutus.softwareversion,
            "termsofuse": aboutus.termsofuse,
            "privacypolicy": aboutus.privacypolicy,
            "email": aboutus.email,
            "web": aboutus.web,
            "phone": aboutus.phone,
            "createddate": firebase.database.ServerValue.TIMESTAMP
        });
    }

    validateUser(email: string, password: string) {
        return this.fireAuth.signInWithEmailAndPassword(email, password)
            .then((authenticatedUser) => { return authenticatedUser.uid })
            .catch(err => {
                throw err;
            });
    }

    findUserByKey(userUid: string): Observable<User> {
        return this.af.database.object('users/' + userUid).map(result => result);
    }

    ///////////// Admin Signup validation against master data that is orgusers. ///////////////////////////

    validateAdminSignup(user: User) {

        return this.verifyUnitNumberAndUnitTypeExists(user.unitnumber, user.unittype).then(res => {
            if (res === 1) {
                // Unitnumber is not present in orgusers.                
                return 1;
            }
            else if (res === 2) {
                // Unitnumber and UnitType are not associated.                
                return 2;
            }
            else if (res === 3) {
                return this.verifyInUsersByUnitNumber(user.unitnumber).then(res => {
                    if (res === true) {
                        // Unit administrator already exists.
                        return 3;
                    }
                    else if (res === false) {
                        // We can create admin now. 
                        return 4;
                    }
                });
            }
        }).catch(err => {
            throw err;
        });
    }

    verifyUnitNumberAndUnitTypeExists(unitnumber: number, unitType: string) {
        var num = 1;
        var orgUserRef = this.rootRef.child('ldsunits').orderByChild('UnitNum').equalTo(Number(unitnumber)).limitToFirst

            (1);
        return orgUserRef.once("value").then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(snap => {
                    if (snap.val().UnitType === unitType) {
                        num = 3;
                    }
                    else if (snap.val().UnitType !== unitType) {
                        num = 2;
                    }
                });
                return num;;
            }
            else {
                return num;
            }
        }).catch(err => { throw err });
    }

    verifyInUsersByUnitNumber(unitnumber: number) {
        var isAdminExists = false;
        var userRef = this.rootRef.child('users').orderByChild('unitnumber').equalTo(Number(unitnumber));
        return userRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(user => {
                    if (user.val().isadmin == true) {
                        isAdminExists = true;
                        return isAdminExists;
                    }
                });
                return isAdminExists;
            }
            else {
                return isAdminExists;
            }
        }).catch(err => { throw err });
    }

    getAdminDataFromOrgUsersByUnitNum(unitNum: number) {
        var unitNumber: string;
        var orgUserRef = this.rootRef.child('orgusers').orderByChild('UnitNum').equalTo(unitNum).limitToFirst(1);
        return orgUserRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
            else {
                return false
            }
        }).catch(err => { throw err });
    }

    getAdminDataFromOrgUsersByEmail(email: string) {
        var orgUserRef = this.rootRef.child('orgusers').orderByChild('UserEmail').equalTo(email).limitToFirst(1);
        return orgUserRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
            else {
                return false
            }
        }).catch(err => { throw err });
    }


    // validateAdminSignup(user: User) {
    //     return this.verifyEmailExists(user.email).then(res => {
    //         if (res == false) {
    //             // Email is not present in orgusers.
    //             // alert('0');
    //             return 0;
    //         }
    //         else {
    //             if (res != user.unitnumber) {
    //                 return this.verifyUnitNumberExists(user.unitnumber).then(res => {
    //                     if (res == false) {
    //                         // Unitnumber is not present in orgusers.
    //                         // alert('1');
    //                         return 1;
    //                     }
    //                     else {
    //                         // Email and Unitnumber are not associated.
    //                         //alert('2');
    //                         return 2;
    //                     }
    //                 }).catch(err => {
    //                     throw err;
    //                 });
    //             }
    //             else {
    //                 // No need to verify email, since firebase will throw error, if we are creating duplicate user.

    //                 // Need to verify in users
    //                 return this.verifyUserByUnitNumber(user.unitnumber).then(res => {
    //                     if (res == true) {
    //                         // Administrator for the unit number provided already exists.
    //                         // alert('3');
    //                         return 3;
    //                     }
    //                     else {
    //                         // Before creating admin check for duplicate ldsusername
    //                         return this.verifyUserByLdsUserName(user.ldsusername).then(res => {
    //                             if (res == true) {
    //                                 // duplicate ldsusername
    //                                 // alert('4');
    //                                 return 4;
    //                             }
    //                             else {
    //                                 //Finally create  admin.........
    //                                 //  alert('5');
    //                                 return 5;
    //                             }
    //                         })
    //                     }
    //                 }).catch(err => {
    //                     throw err;
    //                 });
    //             }
    //         }
    //     }).catch(err => {
    //         throw err;
    //     });
    // }

    verifyEmailExists(email: string) {
        var unitNumber: number;
        var orgUserRef = this.rootRef.child('orgusers').orderByChild('email').equalTo(email).limitToFirst(1);
        return orgUserRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(orgUser => {
                    unitNumber = orgUser.val().unitnumber;
                });
                return unitNumber;
            }
            else {
                // invalid email: email does not exist in org users.
                return false
            }
        }).catch(err => { throw err });
    }

    // verifyUnitNumberExists(unitnumber: number) {
    //     var orgUserRef = this.rootRef.child('orgusers').orderByChild('unitnumber').equalTo(unitnumber).limitToFirst(1);
    //     return orgUserRef.once("value").then((res) => {
    //         if (res.val()) {
    //             return true;
    //         }
    //         else {
    //             return false;
    //         }
    //     }).catch(err => { throw err });
    // } 

    verifyUnitNumberExists(unitnumber: number) {
        var orgUserRef = this.rootRef.child('orgusers').orderByChild('unitnumber').equalTo(Number(unitnumber)).limitToFirst(1);
        return orgUserRef.once("value").then(function (snapshot) {
            if (snapshot.val()) {
                return true;
            }
            else {
                return false;
            }
        }).catch(err => { throw err });
    }

    verifyUserByUnitNumber(unitnumber: number) {
        var isAdminExists = false;
        var userRef = this.rootRef.child('users').orderByChild('unitnumber').equalTo(unitnumber);
        return userRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(user => {
                    if (user.val().isadmin == true) {
                        isAdminExists = true;
                        return true; // for stopping the loop.
                    }
                });
                return isAdminExists;
            }
            else {
                // unitnumber does not exist in users. next check for ldsusername.
                return false;
            }
        }).catch(err => { throw err });
    }

    verifyUserByLdsUserName(ldsUserName: string) {
        var isDuplicateLdsUserName = false;
        var userRef = this.rootRef.child('users').orderByChild('ldsusername').equalTo(ldsUserName);
        return userRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(user => {
                    if (user.val().isactive == true) {
                        isDuplicateLdsUserName = true;
                        return true; // for stopping the loop.
                    }
                });
                return isDuplicateLdsUserName;
            }
            else {
                // ldsusername does not exist. We can create admin for this unit number if there is no duplicate email.
                return false;
            }
        }).catch(err => { throw err });
    }

    getAdminDataFromOrgUsers(email: string) {
        var unitNumber: string;
        var orgUserRef = this.rootRef.child('orgusers').orderByChild('email').equalTo(email).limitToFirst(1);
        return orgUserRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
            else {
                // email does not exist in org users.
                return false
            }
        }).catch(err => { throw err });
    }

    signupNewUser(user, userAvatar) {
        return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((newUser) => {
                // Sign in the user.
                return this.fireAuth.signInWithEmailAndPassword(user.email, user.password)
                    .then((authenticatedUser) => {
                        localStorage.setItem('createdUsrId', authenticatedUser.uid);
                        var usr = firebase.auth().currentUser;
                        return usr.updateProfile({
                            displayName: user.firstname + ' ' + user.lastname,
                            photoURL: userAvatar.url
                        }).then(res => {
                            // Successful login in firebase, create user profile.
                            return this.createAuthUser(user, authenticatedUser.uid).then(res => {
                                this.saveIdenticon(authenticatedUser.uid, userAvatar);
                                return usr.getToken(true).then((idToken) => {
                                    return idToken;
                                });
                            });
                        }).catch(function (error) {
                            throw error;
                        });
                    }).catch(function (error) {
                        throw error;
                        //alert(error.message);
                    });
            }).catch(function (error) {
                throw error;
                //alert(error.message);
            });
    }

    createAuthUser(user: User, uid: any) {
        return this.rootRef.child('users').child(uid).set(
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                ldsusername: user.ldsusername,
                unittype: user.unittype,
                unitnumber: Number(user.unitnumber),
                councils: user.councils,
                calling: '',
                avatar: '',
                isadmin: true, // Never change this...because this is Admin Sign Up.....
                createdby: '',
                createddate: new Date().toDateString(),
                lastupdateddate: new Date().toDateString(),
                isactive: true,
                isnotificationreq: false,
                googlecalendaradded: false,
                pushtoken: '',
                phone: ''
            }).then(() => {
                if (user.councils != null) {
                    user.councils.forEach(counc => {
                        this.createUserCouncils(uid, counc);
                    })
                }
            });
    }

    saveIdenticon(uid: string, img: string) {
        let avatarRef = firebase.storage().ref('/users/avatar/');

        avatarRef.child(uid)
            .putString(img, 'base64', { contentType: 'image/svg+xml' })
            .then((savedPicture) => {
                this.rootRef.child('users').child(uid).update({
                    avatar: savedPicture.downloadURL
                }).then(done => {
                    console.log('Avatar saved');
                }).catch(err => {
                    console.log('Avatar failed to save.', err);
                });

            }).catch(err => {
                console.log('Error storing image', err);
            });

    }

    createUserCouncils(userUid: string, council: string) {
        this.rootRef.child('usercouncils').push({
            userid: userUid,
            councilid: council
        })
    }

    getAdminCouncilsByUnitType(unittype: string) {
        var adminCouncils: string[] = [];
        var councilsRef = this.rootRef.child('councils').orderByChild('counciltype').equalTo(unittype);
        return councilsRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(council => {
                    adminCouncils.push(council.key);
                });
                return adminCouncils;
            }
            else {
                return null;
            }
        }).catch(err => { throw err; });
    }

    setDefaultCouncilsForAdmin(council: string, unitType: string, unitNumber: number, under) {
        return this.rootRef.child('councils').push({
            council: council,
            unittype: unitType,
            unitnumber: Number(unitNumber),
            council_unitnumber: council + '_' + unitNumber,
            under: under
        }).then((res) => {
            return res.key;
        }).catch(err => { throw err });
    }

    insertOrgUser() {
        return this.rootRef.child('orgusers').push({
            avatar: 'avatar',
            calling: 'calling',
            createdby: '',
            createddate: new Date().toISOString(),
            email: 'dev@pk.io',
            firstname: 'Pro',
            isactive: true,
            isadmin: true,
            lastname: 'Karma',
            lastupdateddate: new Date().toISOString(),
            ldsusername: 'ldspro',
            password: '',
            unittype: 'Stake',
            unitnumber: 2626
        }).then((res) => {
            return res.key;
        }).catch(err => { throw err });
    }

    // This is for Area admin sign up, need to add councils data ['President' council] in Stake admin also after creating Area admin
    setAreaAdminDataInStakeAdmins(unitNum, councilId) {
        var dis = this;
        var rootRef = this.rootRef;
        var usrCouncils = [];

        // Area unit number will become parent number for no of Stakes
        var ldsUnitRef = rootRef.child('ldsunits').orderByChild('ParentNum').equalTo(Number(unitNum));
        ldsUnitRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(ldsUnit => {
                    var unitNum = ldsUnit.val().UnitNum;
                    var unitType = ldsUnit.val().UnitType;
                    if (unitType === 'Stake') {
                        // Need to check in 'users' node by 'unitnumber'
                        // If exists then need to insert 'President' record in Councils and User Councils for Stake Admins
                        var userRef = rootRef.child('users').orderByChild('unitnumber').equalTo(Number(unitNum));
                        userRef.once('value').then(function (snapshot) {
                            snapshot.forEach(usr => {
                                if (usr) {
                                    if (usr.val().isadmin === true) {
                                        var userId = usr.key;

                                        usrCouncils = usr.val().councils;
                                        usrCouncils.push(councilId);

                                        // Need to insert in usercouncils and also in councils of user node.
                                        dis.createUserCouncils(userId, councilId);
                                        dis.updateCouncilsInUser(userId, usrCouncils);

                                        return;
                                    }
                                }
                            });
                        });
                    }
                });
            }
            else {

            }
        }).catch(err => { throw err });
    }

    // This is for Stake admin sign up, need to add councils data ['Bishop' council] in Ward admin also after creating Stake admin
    setStakeAdminDataInWardAdmins(unitNum, councilId) {
        var dis = this;
        var rootRef = this.rootRef;
        var usrCouncils = [];

        // Stake unit number will become parent number for no of Wards
        var ldsUnitRef = rootRef.child('ldsunits').orderByChild('ParentNum').equalTo(Number(unitNum));
        ldsUnitRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(ldsUnit => {
                    var unitNum = ldsUnit.val().UnitNum;
                    var unitType = ldsUnit.val().UnitType;
                    if (unitType === 'Ward') {
                        // Need to check in 'users' node by 'unitnumber'
                        // If exists then need to insert 'Bishop' record in Councils and User Councils for Ward Admins
                        var userRef = rootRef.child('users').orderByChild('unitnumber').equalTo(Number(unitNum));
                        userRef.once('value').then(function (snapshot) {
                            snapshot.forEach(usr => {
                                if (usr.val().isadmin === true) {
                                    var userId = usr.key;
                                    usrCouncils = usr.val().councils;

                                    // Need to insert in usercouncils and also in councils of user node.
                                    dis.createUserCouncils(userId, councilId);
                                    usrCouncils.push(councilId);
                                    dis.updateCouncilsInUser(userId, usrCouncils);
                                    return;
                                }
                            });
                        });
                    }
                });
            }
            else {

            }
        }).catch(err => { throw err });
    }

    getAdminData(unitNum) {
        var ldsUnitRef = this.rootRef.child('ldsunits').orderByChild('UnitNum').equalTo(Number(unitNum)).limitToFirst(1);
        return ldsUnitRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
        }).catch(err => { throw err });
    }

    getUserByUnitNum(parentNum) {
        var userRef = this.rootRef.child('users').orderByChild('unitnumber').equalTo(parentNum);
        return userRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
        });
    }

    getCouncilByUnitNum(parentNum, councilName) {
        var councilRef = this.rootRef.child('councils').orderByChild('council_unitnumber').equalTo(councilName + parentNum).limitToFirst(1);
        return councilRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                return snapshot;
            }
        });
    }

    // This is for Ward admin sign up, and need to get data from Stake admin and set it in Ward admin before creating Ward admin
    getStakeAdminDataByWardAdmin(unitNum) {
        var rootRef = this.rootRef;
        var usrCouncils = [];
        var ldsUnitRef = rootRef.child('ldsunits').orderByChild('UnitNum').equalTo(Number(unitNum)).limitToFirst(1);
        return ldsUnitRef.once('value').then(function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(ldsUnit => {
                    var parentNum = ldsUnit.val().ParentNum;
                    var unitType = ldsUnit.val().UnitType;
                    if (unitType === 'Ward') {
                        // Need to check in 'users' node by 'unitnumber' whether Stake admin exists or not.
                        // If exists then need to get that 'Bishop' record from Councils/UserCouncils
                        var userRef = rootRef.child('users').orderByChild('unitnumber').equalTo(parentNum);
                        return userRef.once('value').then(function (snapshot) {
                            snapshot.forEach(usr => {
                                if (usr) {
                                    if (usr.val().isadmin === true) {
                                        var councilRef = rootRef.child('councils').orderByChild('council_unitnumber').equalTo('Bishop_' + parentNum).limitToFirst(1);
                                        return councilRef.once('value').then(function (snapshot) {
                                            if (snapshot.val()) {
                                                return snapshot;
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }).catch(err => { throw err });
    }

    updateCouncilsInUser(userUid: string, newCouncils: string[]) {
        return this.rootRef.child('users/' + userUid).update({ councils: newCouncils }).then(() => {
            return "councils in user updated successfully..."
        }).catch(err => {
            throw err;
        });
    }

    setDefaultNotificationSettings(userId) {
        var notSettingsRef = this.rootRef.child('notificationsettings').orderByChild('userid').equalTo(userId);
        return notSettingsRef.once("value", function (snap) {
            if (!snap.exists()) {
                return firebase.database().ref().child('notificationsettings').push({
                    userid: userId,
                    allactivity: true,
                    agendas: false,
                    discussions: false,
                    pvtdiscussions: false,
                    assignments: false,
                    closingassignment: false,
                    files: false,
                    actinactaccount: false
                });
            }
        });
    }

}
