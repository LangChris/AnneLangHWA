import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { LoginService } from '../../services/login.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public global: GlobalService, public router: Router, public login: LoginService) { }

  ngOnInit() {
  }

  navigateToClaims() {
    this.router.navigate(['claims']);
  }

  navigateToLogin() {
    this.router.navigate(['dashboard']);
  }

  navigateToHome() {
    this.router.navigate(['']);
  }

}
