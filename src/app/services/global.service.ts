import { Injectable } from '@angular/core';
import { DatabaseService } from  '../services/database.service';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms'; 

const brochures = {
  english: "/assets/brochures/NA15%202018%20BRO%20v1.pdf",
  spanish: "/assets/brochures/NA15%202018%20BRO%20V1%20SP.PDF"
};

@Injectable()
export class GlobalService {

  plans: any;
  promo: any;
  settings: any;
  users: any;
  currentUser: any;
  orders: any;
  optionalCoverages: any;
  specialRequests: any;
  loginStatus = "";
  registerStatus = "";
  testing = false;

  constructor(private database: DatabaseService, private datePipe: DatePipe) { }

  get getBrochures() {
    return brochures;
  }

  hwaLogin(username: string, password: string) {
    let login = {
      username: username,
      password: password
    };

    this.database.HwaLogin(login).subscribe(response => {
      this.currentUser = response;
      this.loginStatus = "SUCCESS";
      //console.log(this.currentUser);
    }, error => {
      console.log(error);

      if(error.error.message.includes('Email/Username not found')) {
        this.loginStatus = "BAD_USER";
      }

      if(error.error.message.includes('Invalid password')) {
        this.loginStatus = "BAD_PASS";
      }

    });
  }

  hwaRegisterUser(user: any) {
    if(user.password == null || user.password == '') {
      this.registerStatus = "BAD_PASS";
    } else {
      this.database.HwaRegisterUser(user).subscribe(response => {
        this.currentUser = response;
        this.loginStatus = "SUCCESS";
        this.registerStatus = "SUCCESS";
        //console.log(this.currentUser);
      }, error => {
        console.log(error);
  
        if(error.error.message.includes('Email already exists')) {
          this.registerStatus = "BAD_EMAIL";
        }
  
        if(error.error.message.includes('Username already exists')) {
          this.registerStatus = "BAD_USER";
        }

        if(error.error.status.includes('INTERNAL_SERVER_ERROR')) {
          this.registerStatus = "SERVER_ERROR";
        }
  
      });
    }
  }

  hwaFormatOrders() {
    console.log(this.orders);
    console.log('formatting orders for import...');
    this.database.getOrders().subscribe(
      data => { 
        this.orders = data;
        for(var i = 0; i < this.orders.length; i++) {

          let buyer: any = null;
          let seller: any = null;

        if(this.orders[i].plan != 'Free Sellers Coverage') {
          let buyerName = this.orders[i].buyer_name;
          let buyerEmail = this.orders[i].buyer_email;
          let buyerPhone = this.orders[i].buyer_phone;
          if(buyerName != null || buyerEmail != null || buyerPhone != null) {
            buyer = {
              name: buyerName,
              email: buyerEmail,
              phone: buyerPhone
            };
          }
        }

        if(this.orders[i].plan == 'Free Sellers Coverage') {
          let sellerName = this.orders[i].seller_name;
          let sellerEmail = this.orders[i].seller_email;
          let sellerPhone = this.orders[i].seller_phone;
          if(sellerName != null || sellerEmail != null || sellerPhone != null) {
            seller = {
              name: sellerName,
              email: sellerEmail,
              phone: sellerPhone
            };
          }
        }

    let realtorName = this.orders[i].realtor_name;
    let realtorEmail = this.orders[i].realtor_email;
    let realtorCompany = this.orders[i].realtor_company;
    let realtorZip = this.orders[i].realtor_zip;
    let realtor = {
      name: realtorName,
      email: realtorEmail,
      company: realtorCompany,
      zip: realtorZip
    };

    let titleAgentEmail = this.orders[i].title_agent_email
    let titleAgent = {
      email: titleAgentEmail
    };

          // TODO: format the object here
          let order = {
            orderId: this.orders[i].id,
            address: {
              addressLine: this.orders[i].address_line,
              city: this.orders[i].city,
              state: this.orders[i].state,
              zip: this.orders[i].zip
            },
            buyer: buyer,
            seller: seller,
            closeStartDate: this.orders[i].close_start_date,
            createdDate: this.orders[i].created_date,
            email: this.orders[i].email,
            entered: (this.orders[i].entered == '1' ? true : false),
            homeType: this.orders[i].home_type.toUpperCase().replaceAll(" ", "_").replaceAll("/", "_"),
            hvacCoverage: this.orders[i].hvac_coverage,
            name: this.orders[i].name,
            optionalCoverage: this.orders[i].optional_coverage,
            specialRequest: this.orders[i].special_request,
            plan: this.orders[i].plan.toUpperCase().replaceAll(" ", "_"),
            promo: this.orders[i].promo,
            realtor: realtor,
            titleAgent: titleAgent,
            userId: (this.orders[i].user_id == null ? 0 : this.orders[i].user_id),
            years: this.orders[i].years
          };
          this.orders[i] = order;
        }
      },
      error => {
        console.log(error);
      });
  }

  hwaImportOrders() {
    console.log(this.orders);
    this.database.HwaImportOrders(this.orders).subscribe(response => {
      //console.log(response);
    }, error => console.log(error));
  }

  hwaGetUsers() {
    this.database.HwaUsers().subscribe(response => {
      this.users = response;
      //console.log(this.users);
    }, error => console.log(error));
  }

  hwaGetOrders() {
    this.database.HwaOrders(this.currentUser.token).subscribe(response => {
      this.orders = response;
      //console.log(this.orders);
    }, error => console.log(error));
  }

  hwaGetPlans() {
    this.database.HwaPlans().subscribe(response => {
      this.plans = response;
      //console.log(this.plans);
    }, error => console.log(error));
  }

  hwaGetPromo() {
    this.database.HwaPromo().subscribe(response => {
      this.promo = response;
      if(this.promo != null) {
        this.promo.endDate = new Date(this.promo.endDate);
        this.promo.endDateString = this.datePipe.transform(this.promo.endDate, "MM/dd/yyyy");
      }
      //console.log(this.promo);
    }, error => console.log(error));
  }

  hwaGetSettings() {
    this.database.HwaSettings().subscribe(response => {
      this.settings = response;
      //console.log(this.settings);
    }, error => console.log(error));
  }

  hwaGetSpecialRequests() {
    this.database.HwaSpecialRequests().subscribe(response => {
      this.specialRequests = response;
      //console.log(this.specialRequests);
    }, error => console.log(error));
  }

  hwaGetOptionalCoverages() {
    this.database.HwaOptionalCoverages().subscribe(response => {
      this.optionalCoverages = response;
      //console.log(this.optionalCoverages);
    }, error => console.log(error));
  }

  hwaPlaceOrder(orderForm: FormGroup, type: string) {
    // TODO: build order object from orderForm
    let buyer: any = null;
    let seller: any = null;
    let titleAgent: any = null;

    if(type == 'BUYER') {
      let buyerName = orderForm.controls.buyerName.value;
      let buyerEmail = orderForm.controls.buyerEmail.value;
      let buyerPhone = orderForm.controls.buyerPhone.value;
      if(buyerName != null || buyerEmail != null || buyerPhone != null) {
        buyer = {
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone
        };
      }
      let titleAgentEmail = orderForm.controls.titleAgentEmail.value;
      titleAgent = {
        email: titleAgentEmail
      };
    }

    if(type == 'SELLER') {
      let sellerName = orderForm.controls.sellerName.value;
      let sellerEmail = orderForm.controls.sellerEmail.value;
      let sellerPhone = orderForm.controls.sellerPhone.value;
      if(sellerName != null || sellerEmail != null || sellerPhone != null) {
        seller = {
          name: sellerName,
          email: sellerEmail,
          phone: sellerPhone
        };
      }
    }

    let realtorName = orderForm.controls.realtorName.value;
    let realtorEmail = orderForm.controls.realtorEmail.value;
    let realtorCompany = orderForm.controls.realtorCompany.value;
    let realtorZip = orderForm.controls.realtorZip.value;
    let realtor = {
      name: realtorName,
      email: realtorEmail,
      company: realtorCompany,
      zip: realtorZip
    };
    
    let order = {
      name: orderForm.controls.name.value,
      email: orderForm.controls.email.value,
      plan: orderForm.controls.plan.value,
      years: orderForm.controls.years.value,
      homeType: orderForm.controls.homeType.value,
      address: {
        addressLine: orderForm.controls.addressLine.value,
        city: orderForm.controls.city.value,
        state: orderForm.controls.state.value,
        zip: orderForm.controls.zip.value
      },
      buyer: buyer,
      seller: seller,
      realtor: realtor,
      titleAgent: titleAgent,
      closeStartDate: (type == 'BUYER' ? orderForm.controls.closeStartDate.value : orderForm.controls.startDate.value),
      optionalCoverage: (type == 'BUYER' ? orderForm.controls.optionalCoverage.value : null),
      specialRequest: orderForm.controls.specialRequest.value,
      promo: (type == 'BUYER' ? orderForm.controls.promo.value : null),
      orderTotal: orderForm.controls.orderTotal.value,
      userId: orderForm.controls.userId.value
    };
    console.log(order);

    this.database.HwaPlaceOrder(order).subscribe(response => {
      console.log(response);
    }, error => console.log(error));
  }

  get getMultiCoverage1() {
    return this.promo.coverage.substring(0, this.promo.coverage.indexOf(','));
  }

  get getMultiCoverage2() {
    return this.promo.coverage.substring(this.promo.coverage.indexOf(',') + 1);
  }

  get getMultiCode1() {
    return this.promo.code.substring(0, this.promo.code.indexOf(','));
  }

  get getMultiCode2() {
    return this.promo.code.substring(this.promo.code.indexOf(',') + 1);
  }

  setTestData() {
    console.log('setting test data...');

    // need to update
    this.orders = [
      {
        id: 1,
        user_id: null,
        name: "Test Name 1",
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
        id: 2,
        user_id: null,
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
        id: 3,
        user_id: null,
        name: "Test Name 3",
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
        id: 4,
        user_id: 1,
        name: "Test Name 4",
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
        id: 5,
        user_id: 2,
        name: "Test Name 5",
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
        created_date: this.datePipe.transform(new Date("03/01/2020"), "MM/dd/yyyy")
      },
      {
        id: 6,
        user_id: 2,
        name: "Test Name 6",
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
        created_date: this.datePipe.transform(new Date("03/08/2020"), "MM/dd/yyyy")
      }
    ];

    this.promo = {
      active: true,
      amount: null,
      type: 'Free Coverage Multi',
      gift: null,
      coverage: 'Second Refrigerator,Well Pump',
      endDate: "2020-05-31",
      endDateString: "05/31/2020",
      code: "2ndFridge,WellPump"
    };

    //need to update
    this.plans = {
      gold: {
          name: "Gold",
          price: 450,
          townhomeDiscount: 20,
          options: [
            "Unknown Pre-existing Conditions",
            "Unknown Insufficient Maintenance",
            "Heating System/Furnace",
            "Air Conditioning System/Cooler",
            "Ductwork",
            "Plumbing System",
            "Stoppages/Clogs",
            "Permanent Sump Pump",
            "Water Heater including Tankless",
            "Instant Hot Water Dispenser",
            "Whirlpool Bath Tub",
            "Electrical System",
            "Ceiling Fans and Exhaust Fans",
            "Door Bells, Burglar & Fire Alarm Systems",
            "Central Vacuum",
            "Dishwasher",
            "Garbage Disposal",
            "Built-in Microwave",
            "Range/Oven/Cooktop",
            "Trash Compactor",
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
  
    this.optionalCoverages = [
      {coverageOption: "Pool/Spa Combo", price: "$190/yr."},
      {coverageOption: "Additional Pool or Spa", price: "$190/yr."},
      {coverageOption: "Salt Water Pool (must purchase with Pool/Spa Combo", price: "$345/yr."},
      {coverageOption: "Well Pump", price: "$100/yr."},
      {coverageOption: "Stand Alone Freezer", price: "$50/yr."},
      {coverageOption: "Second Refrigerator", price: "$35/yr."},
      {coverageOption: "Septic System/Sewage Ejector Pump and Septic Tank Pumping", price: "$75/yr."},
      {coverageOption: "External Water Line Repair", price: "$90/yr."},
      {coverageOption: "External Water Line + Sewer & Septic Line Repair", price: "$195/yr."},
      {coverageOption: "Washer/Dryer Package", price: "$85/yr."},
      {coverageOption: "Kitchen Refrigerator w/Ice Maker", price: "$50/yr."},
      {coverageOption: "Green Plus", price: "$70/yr."},
      {coverageOption: "Orange Plus", price: "$100/yr."}
    ];
  
    // need to update
    // this.specialRequest = [
    //   "Over 5000 Sq Ft",
    //   "Multi Level Flat",
    //   "New Construction"
    // ];
  
    // remove
    // this.generalSettings = {
    //   phoneNumber: '703-123-1234',
    //   email: 'anne.lang@homewarrantyamerica.com',
    //   passwordResetEmail: 'anne@annelanghwa.com',
    //   owner: 'Anne Lang',
    //   webpageTitle: 'HWA Home Warranty',
    //   webpageSubTitle: 'Give your clients the best with the only 13 month home warranty',
    //   webpageDescription: 'Welcome get started by viewing our plans, brochures or place an order below.',
    //   orderDescription: 'Fill out the information below to place an order',
    //   orderMessage: 'Thank you - order received! I will be in touch with you very soon',
    //   defaultSortOrder: 'ASC',
    //   defaultFilename: 'MyOrders',
    //   sendEmail: false
    // };

    this.users = [
      {id: 1, name: 'Anne Lang', username: 'Anne.Lang', password: 'VyFyZWwzc3M=', status: 'SUBSCRIBED', type: 'ADMIN', email: 'anne.lang@hwahomewarranty.com', alternateEmail: 'annelang12@gmail.com', phoneNumber: '(703) 220 5933'},
      {id: 2, name: 'Chris Lang', username: '', password: 'VyFyZWwzc3M=', status: 'SUBSCRIBED', type: 'USER', email: 'christopherjlang01@gmail.com', alternateEmail: null, phoneNumber: ''}
    ];

  }

}
