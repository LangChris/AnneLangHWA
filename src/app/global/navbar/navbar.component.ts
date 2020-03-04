import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public global: GlobalService) { }

  contact = {
    phone: "703-220-9633",
    email: "Anne.lang@hwahomewarranty.com"
  };

  ngOnInit() {
  }

}
