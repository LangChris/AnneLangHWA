import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit() {
  }

  navigateToClaims() {
    this.router.navigate(['claims']);
  }

  navigateToLogin() {
    if(this.global.GetSession() == null) {
      this.router.navigate(['dashboard']);
    } else {
      this.global.loginStatus = ""
      this.global.registerStatus = "";
      this.global.ClearSession();
      this.navigateToHome();
    }
  }

  navigateToDashboard() {
    this.router.navigate(['dashboard']);
  }

  navigateToHome() {
    this.router.navigate(['']);
  }

}
