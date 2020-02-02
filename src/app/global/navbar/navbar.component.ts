import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  contact = {
    phone: "703-220-9633",
    email: "Anne.lang@hwahomewarranty.com"
  };

  ngOnInit() {
  }

}
