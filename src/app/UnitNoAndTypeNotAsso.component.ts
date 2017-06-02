import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';

@Component({
    // selector: 'login-form',
    templateUrl: './UnitNoAndTypeNotAsso.html',
    styleUrls: ['./UnitNoAndTypeNotAsso.css']
})

export class unitnoandtypenotassocComponent {
    name;
    email;
    unitNum;

    constructor(private http: Http, public router: Router, private _route: ActivatedRoute) {
      
    }
}