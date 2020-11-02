import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'dashboard-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public dashboard: DashboardComponent, public global: GlobalService) { }

  ngOnInit(): void {
    this.global.hwaGetOrders();
    
    if(this.global.currentUser.type == 'ADMIN') {
      this.global.hwaGetUsers();
    }
  }

}
