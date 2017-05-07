import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';

@Component({
    selector: 'missing-form',
    templateUrl: './Unitmissing.html',
    styleUrls: ['./Unitmissing.css']
})

export class UnitmissingComponent {

    name;
    email;
    unitNum;

    constructor(private http: Http, private _route: ActivatedRoute,
        private _router: Router) {
        this._route.params.subscribe(
            params => {
                this.unitNum = +params['id'];
            });
    }

    sendEmail() {
        this.http.post("https://councilsapi-165009.appspot.com/sendmail", {
            "event": "unitmissing",
            "unitnum": this.unitNum
        }).subscribe((res) => {
            this._router.navigate(['./email'], { relativeTo: this._route });
            console.log("Mail sent")
        });
    }
}         