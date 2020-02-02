import { Injectable } from '@angular/core';

const brochures = {
  english: "/assets/brochures/NA15%202018%20BRO%20v1.pdf",
  spanish: "/assets/brochures/NA15%202018%20BRO%20V1%20SP.PDF"
};

const plans = {
  gold: {
      header: "Gold",
      price: 450.00,
      discount: "-$20 Townhome/Condo/Mobile Home Discount",
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
      options: [
              " Orange Plus"
      ]
  }
};

const promo = {
  active: true,
  title: "$50 OFF",
  subtitle: "New Plan Purchases Through",
  endDate: "3/31/2020",
  code: "HWA50",
  amount: 50
};

@Injectable()
export class GlobalService {

  constructor() { }

  get getBrochures() {
    return brochures;
  }

  get getPlans() {
    return plans;
  }

  get getPromo() {
    return promo;
  }

}
