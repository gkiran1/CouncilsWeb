import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';

@Component({
    // selector: 'login-form',
    templateUrl: './Email.html',
    styleUrls: ['./Email.css'],
})
export class emailComponent {

    constructor(private http: Http) {

        // this.http.post("https://councilsapi-165009.appspot.com/sendmail", {
        //     "event": "admincreated", "email": '', "firstname": '', "lastname": '', "unitnum": '',
        // }).subscribe((res) => { console.log("Mail sent") });

    }
}

