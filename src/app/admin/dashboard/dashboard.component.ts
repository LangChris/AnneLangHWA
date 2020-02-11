import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public admin: AdminComponent) { }

  ngOnInit() {
  }

}
