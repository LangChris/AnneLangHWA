import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'dashboard-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public dashboard: DashboardComponent, public login: LoginService) { }

  ngOnInit(): void {
  }

}
