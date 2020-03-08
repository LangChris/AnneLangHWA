import { Injectable } from '@angular/core';
import { DatabaseService } from  '../services/database.service';
import { DatePipe } from '@angular/common';

const brochures = {
  english: "/assets/brochures/NA15%202018%20BRO%20v1.pdf",
  spanish: "/assets/brochures/NA15%202018%20BRO%20V1%20SP.PDF"
};

@Injectable()
export class GlobalService {

  showPortal: boolean = true;

  promo = {
    active: false,
    amount: 0,
    type: '',
    gift: '',
    endDate: null,
    endDateString: null,
    code: null
  };

  plans = {
    gold: {
        header: null,
        price: 0,
        townhomeDiscount: 0,
        options: []
    },
    platinum: {
        header: null,
        price: 0,
        townhomeDiscount: 0,
        options: []
    },
    diamond: {
        header: null,
        price: 0,
        townhomeDiscount: 0,
        options: []
    }
  };

  optionalCoverage = [];

  specialRequest = [];

  generalSettings = {
    phoneNumber: '',
    email: '',
    owner: '',
    webpageTitle: '',
    webpageSubTitle: '',
    webpageDescription: '',
    orderDescription: '',
    orderMessage: '',
    defaultSortOrder: '',
    defaultFilename: '',
    sendEmail: true
  };

  orders: any;

  testing = true;

  constructor(private database: DatabaseService, private datePipe: DatePipe) { }

  get getBrochures() {
    return brochures;
  }

  get getOrders() {
    return this.orders;
  }

  updateOrders() {
    this.database.getOrders().subscribe(
      data => { 
        this.orders = data;
        for(var i = 0; i < this.orders.length; i++) {
          this.orders[i].close_start_date = this.datePipe.transform(this.orders[i].close_start_date, "MM/dd/yyyy");
        }
      },
      error => {
        console.log(error);
      });
  }

  get getPlans() {
    return this.plans;
  }

  updatePlans() {
    this.database.getPlans().subscribe(
      response => {
        this.plans.gold.header = response[0].name;
        this.plans.gold.price = response[0].price;
        this.plans.gold.townhomeDiscount = response[0].townhome_discount;

        this.plans.platinum.header = response[1].name;
        this.plans.platinum.price = response[1].price;
        this.plans.platinum.townhomeDiscount = response[1].townhome_discount;

        this.plans.diamond.header = response[2].name;
        this.plans.diamond.price = response[2].price;
        this.plans.diamond.townhomeDiscount = response[2].townhome_discount;
      },
      error => console.log(error)
    );
  }

  updatePlanOptions() {
    this.database.getPlanOptions().subscribe(
      response => {
        let data: any;
        data = response;
        for(let i = 0; i < data.length; i++) {
          switch(data[i].plan) {
            case "Gold": this.plans.gold.options.push(" " + data[i].plan_option); break;
            case "Platinum": this.plans.platinum.options.push(" " + data[i].plan_option); break;
            case "Diamond": this.plans.diamond.options.push(" " + data[i].plan_option); break;
          }
        }
      },
      error => console.log(error)
    );
  }

  updateOptionalCoverage() {
    this.database.getOptionalCoverage().subscribe(
      response => {
        let data: any;
        data = response;
        for(let i = 0; i < data.length; i++) {
          let option = {
            option: data[i].coverage_option,
            price: '$' + data[i].price + '/yr.'
          };
          this.optionalCoverage.push(option);
        }
      },
      error => console.log(error)
    );
  }
  
  get getOptionalCoverage() {
    return this.optionalCoverage;
  }

  updateSpecialRequest() {
    this.database.getSpecialRequest().subscribe(
      response => {
        let data: any;
        data = response;
        for(let i = 0; i < data.length; i++) {
          this.specialRequest.push(data[i].request);
        }
      },
      error => console.log(error)
    );
  }

  get getSpecialRequest() {
    return this.specialRequest;
  }

  get getPromo() {
    return this.promo;
  }

  updatePromo() {
    this.database.getPromo().subscribe(
      response => {
        let data: any;
        data = response;
        for(let i = 0; i < data.length; i++) {
          this.promo.active = data[i].active == "1" ? true : false;
          this.promo.amount = data[i].amount;
          this.promo.type = data[i].type;
          this.promo.gift = data[i].gift;
          this.promo.endDate = data[i].end_date;
          this.promo.endDateString = this.datePipe.transform(data[i].end_date, "MM/dd/yyyy");
          this.promo.code = data[i].code;
        }
      },
      error => console.log(error)
    );
  }

  get getShowPortal() {
    return this.showPortal;
  }

  setShowPortal(showPortal: boolean) {
    this.showPortal = showPortal;
  }

  get getGeneralSettings() {
    return this.generalSettings;
  }

  updateGeneralSettings() {
    this.database.getGeneralSettings().subscribe(
      response => {
        this.generalSettings.phoneNumber = response[0].phone_number;
        this.generalSettings.email = response[0].email;
        this.generalSettings.owner = response[0].owner;
        this.generalSettings.webpageTitle = response[0].webpage_title;
        this.generalSettings.webpageSubTitle = response[0].webpage_subtitle;
        this.generalSettings.webpageDescription = response[0].webpage_description;
        this.generalSettings.orderDescription = response[0].order_description;
        this.generalSettings.orderMessage = response[0].order_message;
        this.generalSettings.defaultSortOrder = response[0].default_sort_order;
        this.generalSettings.defaultFilename = response[0].default_filename;
        this.generalSettings.sendEmail = response[0].send_email == "1" ? true : false;
      },
      error => console.log(error)
    );
  }

  setTestData() {
    console.log('setting test data...');

    this.orders = [
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: "Pool/Spa Combo, Well Pump",
        special_request: "Over 5000 Sq Ft, New Construction",
        hvac_coverage: null,
        realtor_name: "Test Realtor Name 3",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: null,
        special_request: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 2",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: null,
        special_request: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 1",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: null,
        special_request: "Multi Level Flat",
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 5",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: null,
        special_request: null,
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 1",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
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
        close_start_date: this.datePipe.transform(new Date("03/31/2020"), "MM/dd/yyyy"),
        optional_coverage: null,
        special_request: "New Construction",
        hvac_coverage: "No",
        realtor_name: "Test Realtor Name 11",
        realtor_email: "testrealtor@gmail.com",
        realtor_company: "Remax",
        realtor_zip: "22033",
        title_agent_email: null,
        promo: null,
        entered: 0,
        created_date: this.datePipe.transform(new Date("02/24/2020"), "MM/dd/yyyy")
      }
    ];

    this.promo = {
      active: true,
      amount: 0,
      type: 'Free Gift',
      gift: 'Echo Dot',
      endDate: new Date("03/31/2020"),
      endDateString: "03/31/2020",
      code: "HWA50"
    };

    this.plans = {
      gold: {
          header: "Gold",
          price: 450,
          townhomeDiscount: 20,
          options: [
            "Unknown Pre-existing Conditions",
            "Unknown Insufficient Maintenance",
            "Air Conditioning System/Cooler",
            "Garage Door Opener"
          ]
      },
      platinum: {
          header: "Platinum",
          price: 550,
          townhomeDiscount: 30,
          options: [
            "Kitchen Refrigerator w/ Ice Maker",
            "Washer/Dryer Package",
            "Telephone Line Coverage",
            "Re-Key",
            "SEER/R-410A Modifications",
            "Premium Coverage"
          ]
      },
      diamond: {
          header: "Diamond",
          price: 590,
          townhomeDiscount: 30,
          options: ["Orange Plus"]
      }
    };
  
    this.optionalCoverage = [
      {option: "Pool/Spa Combo", price: "$190/yr."},
      {option: "Well Pump", price: "$100/yr."},
      {option: "Green Plus", price: "$70/yr."},
      {option: "Orange Plus", price: "$100/yr."}
    ];
  
    this.specialRequest = [
      "Over 5000 Sq Ft",
      "Multi Level Flat",
      "New Construction"
    ];
  
    this.generalSettings = {
      phoneNumber: '703-232-8168',
      email: 'christopherjlang01@gmail.com',
      owner: 'CJ Lang',
      webpageTitle: 'HWA Home Warranty',
      webpageSubTitle: 'Give your clients the best with the only 13 month home warranty',
      webpageDescription: 'Here is the webpage description',
      orderDescription: 'Fill out the information below to place an order',
      orderMessage: 'Thank you. I will be in touch with you very soon!',
      defaultSortOrder: 'DESC',
      defaultFilename: 'export',
      sendEmail: false
    };

  }

}
