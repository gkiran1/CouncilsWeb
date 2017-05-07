import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';

@Component({
    // selector: 'login-form',
    templateUrl: './Unitadministrator.html',
    styleUrls: ['./Unitadministrator.css']
})

export class unitadministratorComponent {
    name;
    email;
    unitNum;

    constructor(private http: Http, public router: Router, private _route: ActivatedRoute) {
        this._route.params.subscribe(
            params => {
                this.unitNum = +params['id'];
            });
    }

    sendEmail() {
        this.http.post("https://councilsapi-165009.appspot.com/sendmail", {
            "event": "unitadminexist",
            "unitnum": this.unitNum,
            "name": this.name,
            "email": this.email
        }).subscribe((res) => {
            this.router.navigate(['./email'], { relativeTo: this._route });
            console.log("Mail sent")
        });
    }

}