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

    hasFocus(label) {
        document.getElementById(label).setAttribute("class", "input-has-focus");
        document.getElementById(label).style.color = "#3cb18a";
    }

    lostFocus(t, e) {
        if(0 === (<HTMLInputElement>document.getElementById(e)).value.length)
        { 
            document.getElementById(t).removeAttribute("class");
            document.getElementById(t).style.color = "#a9aaac";
        }
        else {
            this.hasFocus(t) 
        }
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