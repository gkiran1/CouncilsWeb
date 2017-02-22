"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var firebase = require("firebase");
// import {validate,Validator,Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
var RegisterPageComponent = (function () {
    function RegisterPageComponent(http, af) {
        this.http = http;
        this.af = af;
        this.units = [
            'Stake Unit #',
            'Ward Unit #'
        ];
        this.registerCredentials = { email: '', password: '', ldsorgusername: '', platform: '', stakeunit: '', wardunit: '' };
        this.fireAuth = firebase.auth();
        this.userProfile = firebase.database().ref('users');
    }
    // create() {
    //   // this.nav.push(DisplayPage, this.registerCredentials);
    // }
    RegisterPageComponent.prototype.signUpUser = function (registerCredentials) {
        var _this = this;
        this.fireAuth.createUserWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then(function (newUser) {
            // Sign in the user.
            _this.fireAuth.signInWithEmailAndPassword(registerCredentials.email, registerCredentials.password).then(function (authenticatedUser) {
                // Successful login, create user profile.
                _this.userProfile.child(authenticatedUser.uid).set({
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
    };
    RegisterPageComponent.prototype.register = function () {
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
    };
    return RegisterPageComponent;
}());
RegisterPageComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: 'register.html',
        styleUrls: ['./register.css']
    })
], RegisterPageComponent);
exports.RegisterPageComponent = RegisterPageComponent;
//# sourceMappingURL=app.component.js.map