import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user/user';
import { FirebaseService } from '../../src/firebase/firebase-service';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { Observable } from "rxjs/Rx";


@Component({
    selector: 'login-form',
    templateUrl: './Login.html',
    styleUrls: ['./Login.css'],
    providers: [FirebaseService]
})

export class LoginComponent {
    userCred$: User

    constructor(private firebaseService: FirebaseService) {
        this.userCred$ = new User();
    }

    Login(event: any) {
        this.firebaseService.validateUser(this.userCred$.email, this.userCred$.password).then(uid => {
            this.firebaseService.findUserByKey(uid).subscribe(usr => {
                this.userCred$ = usr
                alert('User logged in.....')
            })
        }).catch(err => {
            alert(err);
        });
    }

}