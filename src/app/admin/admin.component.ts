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

  display = {
    dashboard: true,
    view: false,
    edit: false
  };

  showError: boolean = false;
  showSuccess: boolean = false;

  filter = {
    timeline: 'all',
    plan: 'all',
    homeType: 'all',
    entered: 'all',
    years: 'all',
    realtor: 'all',
    sort: 'ASC'
  };

  testing = false;


  constructor(private database: DatabaseService, public login: LoginService, private global: GlobalService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.global.setShowPortal(false);
  }

  getFilteredOrders() {
    if(!this.testing) {
      return this.database.getOrders().subscribe(
        data => { 
          this.orders = data;
          for(var i = 0; i < this.orders.length; i++) {
            this.orders[i].close_start_date = this.datePipe.transform(this.orders[i].close_start_date, "MM/dd/yyyy");
          }
          this.filterByTimeline();
          this.filterByPlan();
          this.filterByHomeType();
          this.filterByEntered();
          this.filterByYears();
          this.filterByRealtor();
          this.sortOrders();
        },
        error => {
          console.log(error);
        });
    } else {
      this.setTestData();
      this.filterByTimeline();
      this.filterByPlan();
      this.filterByHomeType();
      this.filterByEntered();
      this.filterByYears();
      this.filterByRealtor();
      this.sortOrders();
    }
  }
  
  getOrders() {
    if(!this.testing) {
    return this.database.getOrders().subscribe(
      data => { 
        this.orders = data;
        for(var i = 0; i < this.orders.length; i++) {
          this.orders[i].close_start_date = this.datePipe.transform(this.orders[i].close_start_date, "MM/dd/yyyy");
          if(!this.realtors.includes(this.orders[i]['realtor_name'])) {
            this.realtors.push(this.orders[i]['realtor_name']);
          }
        }
        this.sortOrders();
      },
      error => {
        console.log(error);
      });
    } else {
      this.setTestData();
      for(var i = 0; i < this.orders.length; i++) {
        if(!this.realtors.includes(this.orders[i]['realtor_name'])) {
          this.realtors.push(this.orders[i]['realtor_name']);
        }
      }
      this.sortOrders();
    }
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

  updateDisplay(view: boolean, edit: boolean, dashboard: boolean) {
    this.showError = false;
    this.showSuccess = false;

    this.display.view = view;
    this.display.edit = edit;
    this.display.dashboard = dashboard;
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

  setTestData() {
    let testData = [
      {
        id: 17,
        name: "Test Name 3",
        email: "testemail@gmail.com",
        plan: "Gold",
        years: "2 Years",
        home_type: "Single Family Home",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: "Test Buyer 1",
        buyer_email: "testbuyer@gmail.com",
        seller_name: null,
        seller_email: null,
        close_start_date: this.datePipe.transform(new Date(), "MM/dd/yyyy"),
        optional_coverage: "Pool/Spa Combo, Well Pump, ",
        hvac_coverage: null,
        realtor_name: "Test Realtor Name 3",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: "titleagent@gmail.com",
        promo: "HWA50",
        entered: 1,
        created_date: this.datePipe.transform(new Date("12/10/2019"), "MM/dd/yyyy")
      },
      {
        id: 6,
        name: "Test Name 2",
        email: "testemail@gmail.com",
        plan: "Free Sellers Coverage",
        years: "13 Months",
        home_type: "Townhome/Condo",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: null,
        buyer_email: null,
        seller_name: "Test Seller 2",
        seller_email: "testseller@gmail.com",
        close_start_date: this.datePipe.transform(new Date() , "MM/dd/yyyy"),
        optional_coverage: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 2",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/20/2020"), "MM/dd/yyyy")
      },
      {
        id: 2,
        name: "Test Name 1",
        email: "testemail@gmail.com",
        plan: "Diamond",
        years: "13 Months",
        home_type: "Townhome/Condo",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: null,
        buyer_email: null,
        seller_name: "Test Seller 2",
        seller_email: "testseller@gmail.com",
        close_start_date: this.datePipe.transform(new Date() , "MM/dd/yyyy"),
        optional_coverage: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 1",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/24/2020"), "MM/dd/yyyy")
      },
      {
        id: 16,
        name: "Test Name 5",
        email: "testemail@gmail.com",
        plan: "Gold",
        years: "13 Months",
        home_type: "Townhome/Condo",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: null,
        buyer_email: null,
        seller_name: "Test Seller 2",
        seller_email: "testseller@gmail.com",
        close_start_date: this.datePipe.transform(new Date() , "MM/dd/yyyy"),
        optional_coverage: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 5",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/24/2020"), "MM/dd/yyyy")
      },
      {
        id: 22,
        name: "Test Name 6",
        email: "testemail@gmail.com",
        plan: "Free Sellers Coverage",
        years: "3 Years",
        home_type: "Single Family Home",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: null,
        buyer_email: null,
        seller_name: "Test Seller 2",
        seller_email: "testseller@gmail.com",
        close_start_date: this.datePipe.transform(new Date() , "MM/dd/yyyy"),
        optional_coverage: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 1",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/24/2020"), "MM/dd/yyyy")
      },
      {
        id: 2,
        name: "Test Name 7",
        email: "testemail@gmail.com",
        plan: "Platinum",
        years: "13 Months",
        home_type: "Townhome/Condo",
        address_line: "123 Main St.",
        city: "Fairfax",
        state: "VA",
        zip: 22033,
        buyer_name: null,
        buyer_email: null,
        seller_name: "Test Seller 2",
        seller_email: "testseller@gmail.com",
        close_start_date: this.datePipe.transform(new Date() , "MM/dd/yyyy"),
        optional_coverage: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 11",
        realtor_email: "testrealtor@gmail.com",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/24/2020"), "MM/dd/yyyy")
      }
    ];

    this.orders = testData;
  }

}
