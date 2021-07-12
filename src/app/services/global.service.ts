import { Injectable } from '@angular/core';
import { DatabaseService } from  '../services/database.service';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms'; 

const brochures = {
  english: "/assets/brochures/NA16%202021%20BRO%20V1.6%20-%20New%20Brochure%202021.pdf",
  spanish: "/assets/brochures/NA16%202021%20BRO%20V1.6%20SP.PDF"
};

@Injectable()
export class GlobalService {

  plans: any;
  promo: any;
  activePromos: any;
  settings: any;
  users: any;
  orders: any;
  optionalCoverages: any;
  specialRequests: any;
  loginStatus = "";
  registerStatus = "";
  applicationStatus = "Temporarily Unavailable - Please try again later";

dashboardTabs = {
    GENERAL: {
      label: 'General',
      active: true,
      class: 'fa fa-gear'
    },
    PASSWORD: {
      label: 'Login',
      active: false,
      class: 'fa fa-lock'
    },
    USERS: {
      label: 'Users',
      active: false,
      class: 'fa fa-user'
    },
    ORDERS: {
      label: 'Orders',
      active: false,
      class: 'fa fa-bars'
    },
    EDIT: {
      label: 'Edit',
      active: false,
      class: 'fa fa-pencil'
    }
  };

  constructor(private database: DatabaseService, private datePipe: DatePipe) { }

  get getBrochures() {
    return brochures;
  }

  GetSession() {
    let CurrentUser = sessionStorage.getItem('CurrentUser');
    return JSON.parse(CurrentUser);
  }

  ClearSession() {
    sessionStorage.removeItem('CurrentUser');
    // then navigate home
  }

  hwaApiHealth() {
    this.database.HwaApiHealthCheck().subscribe(response => {
      this.applicationStatus = response['status'];
    }, error => {
      this.applicationStatus = 'Temporarily Unavailable - Please try again later';
    });
  }

  hwaLogin(username: string, password: string) {
    let login = {
      username: username,
      password: password
    };

    this.database.HwaLogin(login).subscribe(response => {
      this.loginStatus = "SUCCESS";
      sessionStorage.setItem('CurrentUser', JSON.stringify(response));
      this.hwaGetOrders();
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
    this.database.HwaRegisterUser(user).subscribe(response => {
      sessionStorage.setItem('CurrentUser', JSON.stringify(response));
      this.loginStatus = "SUCCESS";
      this.registerStatus = "SUCCESS";
    }, error => {
      console.log(error);

      if(error.error.message.includes('Email already exists')) {
        this.registerStatus = "EMAIL_EXISTS";
      }

      if(error.error.message.includes('Username already exists')) {
        this.registerStatus = "USER_EXISTS";
      }

      if(error.error.status.includes('INTERNAL_SERVER_ERROR')) {
        this.registerStatus = "SERVER_ERROR";
      }

    });
  }

  hwaGetUsers() {
    this.database.HwaUsers(this.GetSession().token).subscribe(response => {
      this.users = response;
      for(let i = 0; i < this.users.length; i++) {
        try {
        this.users[i].dateAddedString = this.datePipe.transform(this.users[i].dateAdded, "MM/dd/yyyy");
        } catch(e) {
          this.users[i].dateAddedString = null;
        }
      }
      //console.log(this.users);
    }, error => console.log(error));
  }

  hwaGetOrders() {
    this.database.HwaOrders(this.GetSession().token).subscribe(response => {
      this.orders = response;
      for(let i = 0; i < this.orders.length; i++) {
        try {
        this.orders[i].closeStartDateString = this.datePipe.transform(this.orders[i].closeStartDate, "MM/dd/yyyy");
        } catch(e) {
          this.orders[i].closeStartDateString = null;
        }
      }
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
        this.promo.endDate = this.datePipe.transform(this.promo.endDate, "yyyy-MM-dd");
        this.promo.endDateString = this.datePipe.transform(this.promo.endDate, "MM/dd/yyyy");
        if(this.promo.type == 'Free Coverage Multi') {
          let coverages = this.promo.coverage.split(',');
          let codes = this.promo.code.split(',');
          this.promo.coverages = [];
          for(let i  = 0; i < coverages.length; i++) {
            this.promo.coverages.push(
              {
                coverage: coverages[i],
                code: codes[i]
              }
            );
          }
        }
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

}
