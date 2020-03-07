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
    defaultSortOrder: '',
    defaultFilename: '',
    sendEmail: true
  };

  constructor(private database: DatabaseService, private datePipe: DatePipe) { }

  get getBrochures() {
    return brochures;
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
        this.generalSettings.defaultSortOrder = response[0].default_sort_order;
        this.generalSettings.defaultFilename = response[0].default_filename;
        this.generalSettings.sendEmail = response[0].send_email == "1" ? true : false;
      },
      error => console.log(error)
    );
  }

}
