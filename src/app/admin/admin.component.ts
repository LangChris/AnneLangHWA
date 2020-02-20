import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';
import { PHPService } from '../services/php.service'; 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  orders: any;

  display = {
    dashboard: true,
    view: false,
    edit: false
  };

  showError: boolean = false;
  showSuccess: boolean = false;

  sortDirection = 'ASC'; // Oldest to Newest


  constructor(private php: PHPService, public login: LoginService, private global: GlobalService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.global.setShowPortal(false);
  }

  getOrders() {
    return this.php.getOrders().subscribe(
      data => { 
        this.orders = data;
        for(var i = 0; i < this.orders.length; i++) {
          this.orders[i].close_start_date = this.datePipe.transform(this.orders[i].close_start_date, "MM/dd/yyyy");
        }
        this.sortOrders(this.sortDirection);
      },
      error => console.log(error)
      );
  }

  setOrders(daysBack: number) {
    this.php.getOrders().subscribe(
      data => { 
        this.orders = data;
        for(var i = 0; i < this.orders.length; i++) {
          this.orders[i].close_start_date = this.datePipe.transform(this.orders[i].close_start_date, "MM/dd/yyyy");
        }
        this.sortOrders(this.sortDirection);

        let filteredOrders = [];
        var dateOffset = (24*60*60*1000) * daysBack; //30 days
        var endDate = new Date();
        var startDate = new Date();
        startDate.setTime(startDate.getTime() - dateOffset);
        for(var i = 0; i < this.orders.length; i++) {
          var createdDate = new Date(this.orders[i].created_date);
          if(createdDate.getTime() >= startDate.getTime() && createdDate.getTime() <= endDate.getTime()) {
            filteredOrders.push(this.orders[i]);
          }
        }
        this.orders = filteredOrders;

      },
      error => console.log(error)
      );
  }

  sortOrders(direction: string) {
    this.sortDirection = direction;
    switch(this.sortDirection) {
      case "ASC": this.orders.sort((a,b) => a.id.localeCompare(b.id)); break;
      case "DESC": {
        this.orders.sort((a,b) => a.id.localeCompare(b.id));
        this.orders = this.orders.reverse();
        break;
      }
    }
  }

  updateDisplay(view: boolean, edit: boolean, dashboard: boolean) {
    this.showError = false;
    this.showSuccess = false;

    this.display.view = view;
    this.display.edit = edit;
    this.display.dashboard = dashboard;
  }

  filterOrders(filter: any) {
    switch(filter) {
      case "all": this.getOrders(); break;
      case "last-7-days": this.setOrders(7); break;
      case "last-30-days": this.setOrders(30); break;
      case "last-60-days": this.setOrders(60); break;
      case "last-90-days": this.setOrders(90); break;
    }
  }

}
