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
            "createddate": ((new Date()).toString()).slice(0, 16)
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


}
