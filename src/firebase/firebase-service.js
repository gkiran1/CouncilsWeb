"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require("@angular/http");
var angularfire2_1 = require('angularfire2');
var firebase = require('firebase');
require('rxjs/Rx');
var FirebaseService = (function () {
    function FirebaseService(_http, af) {
        this._http = _http;
        this.af = af;
        this.fireAuth = firebase.auth();
        this.rootRef = firebase.database().ref();
    }
    FirebaseService.prototype.createAboutUs = function (aboutus) {
        this.rootRef.child('aboutus').push({
            "softwareversion": aboutus.Softwareversion,
            "termsofuse": aboutus.termsofuse,
            "privatepolicy": aboutus.privatepolicy,
            "email": aboutus.Email,
            "web": aboutus.Web,
            "phone": aboutus.Phone,
        });
    };
    FirebaseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, angularfire2_1.AngularFire])
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase-service.js.map