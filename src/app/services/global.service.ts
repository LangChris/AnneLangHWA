import { Injectable } from '@angular/core';
import { DatabaseService } from  '../services/database.service';
import { DatePipe } from '@angular/common';

const brochures = {
  english: "/assets/brochures/NA15%202018%20BRO%20v1.pdf",
  spanish: "/assets/brochures/NA15%202018%20BRO%20V1%20SP.PDF"
};

const plans = {
  gold: {
      header: "Gold",
      price: 450.00,
      discount: "-$20 Townhome/Condo/Mobile Home Discount",
      townhomeDiscount: 20.00,
      options: [
              " Unknown Pre-existing Conditions",
              " Unknown Insufficient Maintenance",
              " Heating System/Furnace",
              " Air Conditioning System/Cooler",
              " Ductwork",
              " Plumbing System",
              " Stoppages/Clogs",
              " Permanent Sump Pump",
              " Water Heater including Tankless",
              " Instant Hot Water Dispenser",
              " Whirlpool Bath Tub",
              " Electrical System",
              " Ceiling Fans and Exhaust Fans",
              " Door Bells, Burglar & Fire Alarm Systems",
              " Central Vacuum",
              " Dishwasher",
              " Garbage Disposal",
              " Built-in Microwave",
              " Range/Oven/Cooktop",
              " Trash Compactor",
              " Garage Door Opener"
      ]
  },
  platinum: {
      header: "Platinum",
      price: 550.00,
      discount: "-$30 Townhome/Condo/Mobile Home Discount",
      townhomeDiscount: 30.00,
      options: [
              " Kitchen Refrigerator w/ Ice Maker",
              " Washer/Dryer Package",
              " Telephone Line Coverage",
              " Re-Key",
              " SEER/R-410A Modifications",
              " Premium Coverage"
      ]
  },
  diamond: {
      header: "Diamond",
      price: 590.00,
      discount: "-$30 Townhome/Condo/Mobile Home Discount",
      townhomeDiscount: 30.00,
      options: [
              " Orange Plus"
      ]
  }
};

const optionalCoverage = [
  { option: "Pool/Spa Combo", price: "$190.00/yr." },
  { option: "Additional Pool or Spa", price: "$190.00/yr." },
  { option: "Salt Water Pool (must purchase with Pool/Spa Combo)", price: "$345.00/yr." },
  { option: "Well Pump", price: "$100.00/yr." },
  { option: "Stand Alone Freezer", price: "$50.00/yr." },
  { option: "Second Refrigerator", price: "$35.00/yr." },
  { option: "Septic System/Sewage Ejector Pump and Septic Tank Pumping", price: "$75.00/yr." },
  { option: "External Water Line Repair", price: "$90.00/yr." },
  { option: "External Water Line + Sewer & Septic Line Repair", price: "$195.00/yr." },
  { option: "Washer/Dryer Package", price: "$85.00/yr." },
  { option: "Kitchen Refrigerator w/Ice Maker", price: "$50.00/yr." },
  { option: "Green Plus", price: "$70.00/yr." },
  { option: "Orange Plus", price: "$100.00/yr." },
];

const promo = {
  active: true,
  title: "$50 OFF",
  subtitle: "New Plan Purchases Through",
  endDate: "3/31/2020",
  code: "HWA50",
  amount: 50.00
};

@Injectable()
export class GlobalService {

  showPortal: boolean = true;

  promo = {
    active: false,
    amount: 0,
    endDate: null,
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

  constructor(private database: DatabaseService, private datePipe: DatePipe) { }

  get getBrochures() {
    return brochures;
  }

  get getPlans() {
    return plans;
  }

  updatePlans() {
    this.database.getPlans().subscribe(
      response => {
        
      },
      error => console.log(error)
    );
  }

  updatePlanOptions() {
    this.database.getPlanOptions().subscribe(
      response => {
        
      },
      error => console.log(error)
    );
  }
  
  get getOptionalCoverage() {
    return optionalCoverage;
  }

  get getPromo() {
    return this.promo;
  }

  updatePromo() {
    this.database.getPromo().subscribe(
      response => {
        this.promo.active = response[0].active;
        this.promo.amount = response[0].amount;
        this.promo.endDate = this.datePipe.transform(response[0].end_date, "MM/dd/yyyy");
        this.promo.code = response[0].code;
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

}
