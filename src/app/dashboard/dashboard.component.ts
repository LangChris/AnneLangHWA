import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  display = 'DASHBOARD';

  showError: boolean = false;
  showSuccess: boolean = false;

  orders: any;
  realtors = [];

  filter = {
    timeline: 'all',
    plan: 'all',
    homeType: 'all',
    entered: 'all',
    years: 'all',
    realtor: 'all',
    sort: this.global.currentUser != null ? this.global.currentUser.defaultSort : "DESC"
  };

  constructor(public login: LoginService, public global: GlobalService) { }

  ngOnInit(): void {
    
  }

  getOrders() {
    for(var i = 0; i < this.global.orders.length; i++) {
      if(this.global.orders[i].realtor != null && !this.realtors.includes(this.global.orders[i].realtor.name)) {
        this.realtors.push(this.global.orders[i].realtor.name);
      }

      this.global.orders[i].createdDate = new Date(this.global.orders[i].createdDate);
      this.global.orders[i].closeStartDate = new Date(this.global.orders[i].closeStartDate);
    }

    this.orders = this.global.orders;
    this.sortOrders();
  }

  sortOrders() {
    switch(this.filter.sort) {
      case "ASC": this.orders.sort((a,b) => a.orderId-b.orderId); break;
      case "DESC": this.orders.sort((a,b) => b.orderId-a.orderId); break;
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
      var createdDate = new Date(this.orders[i].createdDate);
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
      if(this.orders[i].homeType == this.filter.homeType) {
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
      if(this.orders[i].entered == (this.filter.entered == 'entered' ? true : false)) {
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
      if(this.orders[i].realtor != null && this.orders[i].realtor.name == this.filter.realtor) {
        filteredOrders.push(this.orders[i]);
      }
    }

    this.orders = filteredOrders;
  }

  updateDisplay(display: string) {
    this.showError = false;
    this.showSuccess = false;

    this.display = display;
    if(display == 'DASHBOARD' && !this.global.testing) {
      this.global.hwaGetOrders();
    }
  }

  getFilteredOrders() {
    this.getOrders();
    this.filterByTimeline();
    this.filterByPlan();
    this.filterByHomeType();
    this.filterByEntered();
    this.filterByYears();
    this.filterByRealtor();
    this.sortOrders();
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
