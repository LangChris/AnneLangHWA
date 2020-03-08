import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service'; 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  orders: any;
  realtors = [];

  display = 'DASHBOARD';

  showError: boolean = false;
  showSuccess: boolean = false;

  filter = {
    timeline: 'all',
    plan: 'all',
    homeType: 'all',
    entered: 'all',
    years: 'all',
    realtor: 'all',
    sort: this.global.getGeneralSettings.defaultSortOrder
  };

  constructor(private database: DatabaseService, public login: LoginService, private global: GlobalService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.global.setShowPortal(false);
  }

  getFilteredOrders() {
    this.orders = this.global.getOrders;
    this.filterByTimeline();
    this.filterByPlan();
    this.filterByHomeType();
    this.filterByEntered();
    this.filterByYears();
    this.filterByRealtor();
    this.sortOrders();
  }
  
  getOrders() {
    this.orders = this.global.getOrders;
    for(var i = 0; i < this.orders.length; i++) {
      if(!this.realtors.includes(this.orders[i]['realtor_name'])) {
        this.realtors.push(this.orders[i]['realtor_name']);
      }
    }
    this.sortOrders();
  }

  sortOrders() {
    switch(this.filter.sort) {
      case "ASC": this.orders.sort((a,b) => a.id-b.id); break;
      case "DESC": this.orders.sort((a,b) => b.id-a.id); break;
    }
  }

  filterByTimeline() {
    if(this.filter.timeline == 'all') {
      return;
    }

    let filteredOrders = [];

    let days = +this.filter.timeline.substring(this.filter.timeline.indexOf("-") + 1, this.filter.timeline.lastIndexOf("-"));
    var dateOffset = (24*60*60*1000) * days; 
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
  }

  filterByPlan() {
    if(this.filter.plan == 'all') {
      return;
    }

    let filteredOrders = [];

    for(var i = 0; i < this.orders.length; i++) {
      if(this.orders[i].plan == this.filter.plan) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  filterByHomeType() {
    if(this.filter.homeType == 'all') {
      return;
    }

    let filteredOrders = [];

    for(var i = 0; i < this.orders.length; i++) {
      if(this.orders[i].home_type == this.filter.homeType) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  filterByEntered() {
    if(this.filter.entered == 'all') {
      return;
    }

    let filteredOrders = [];

    for(var i = 0; i < this.orders.length; i++) {
      if(this.orders[i].entered == (this.filter.entered == 'entered' ? 1 : 0)) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  filterByYears() {
    if(this.filter.years == 'all') {
      return;
    }

    let filteredOrders = [];

    for(var i = 0; i < this.orders.length; i++) {
      if(this.orders[i].years == this.filter.years) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  filterByRealtor() {
    if(this.filter.realtor == 'all') {
      return;
    }

    let filteredOrders = [];

    for(var i = 0; i < this.orders.length; i++) {
      if(this.orders[i].realtor_name == this.filter.realtor) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  updateDisplay(display: string) {
    this.showError = false;
    this.showSuccess = false;

    this.display = display;
  }

  filterOrders(sort: string, timeline: string, plan: string, homeType: string, entered: string, years: string, realtor: string) {
    this.filter = {
      timeline: timeline,
      plan: plan,
      homeType: homeType,
      sort: sort,
      entered: entered,
      years: years,
      realtor: realtor
    };

    this.getFilteredOrders();
  }

}
