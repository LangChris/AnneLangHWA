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

  dropdown = {
    contact: false,
    help: false,
    profile: false
  };

  ngOnInit() {
  }

  navigateToClaims() {
    this.closeDropdowns();
    this.global.clearActiveTab();
    this.router.navigate(['claims']);
  }

  navigateToLogin() {
    this.closeDropdowns();
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
    this.closeDropdowns();
    this.router.navigate(['dashboard']);
  }

  navigateToHome() {
    this.closeDropdowns();
    this.global.clearActiveTab();
    this.router.navigate(['']);
  }

  doLogout() {
    this.closeDropdowns();
    this.global.clearActiveTab();
    this.global.ClearSession();
    this.router.navigate(['']);
  }

  toggleDropdown(dropdown) {
    this.dropdown[dropdown] = !this.dropdown[dropdown];

    for(let key of Object.keys(this.dropdown)) {
      if(key != dropdown)
        this.dropdown[key] = false;
    }
  }

  closeDropdowns() {
    for(let key of Object.keys(this.dropdown)) {
        this.dropdown[key] = false;
    }
  }

}
