import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'missing-form',
    templateUrl: './Unitmissing.html',
    styleUrls: ['./Unitmissing.css']
})

export class UnitmissingComponent {
    unitNum;

    constructor(private _route: ActivatedRoute,
        private _router: Router) {
        this._route.params.subscribe(
            params => {
                this.unitNum = +params['id'];
            });
    }

    sendEmail() {
        
    }
}