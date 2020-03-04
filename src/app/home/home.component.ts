import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public global: GlobalService, private router: Router) { }

  pageProperties = {
    header: "HWA - Your Home Warranty Partner",
    subheader: "Give your clients the best with the only 13-month home warranty.",
    description: "Welcome to my information page!  HWA offers coverage for the appliances and systems in your home whether you are purchasing a resale home, or currently own a home and want coverage.  This coverage is specifically designed for our Realtor partners and their clients.  View plans, get information and place an order here..."
  };

  ngOnInit() {
    this.global.updatePlans();
    this.global.updatePlanOptions();
    this.global.updateOptionalCoverage();
    this.global.setShowPortal(true);
  }

  priceStyle() {
    return {
      'text-decoration': this.global.getPromo.active ? 'line-through' : 'none',
      'text-decoration-color': this.global.getPromo.active ? '#eb5e17' : 'orange',
      'font-size': this.global.getPromo.active ? '25px' : '30px'
    }
  }

  navigateToBrochure(language: string) {
    switch(language) {
      case "english": window.open(this.global.getBrochures.english, "_blank"); break;
      case "spanish": window.open(this.global.getBrochures.spanish, "_blank"); break;
    }
  }

  navigateToOrderForm(plan: string) {
    switch(plan) {
      case "gold": this.router.navigate(['/order-form', { plan: "Gold"}]); break;
      case "platinum": this.router.navigate(['/order-form', { plan: "Platinum"}]); break;
      case "diamond": this.router.navigate(['/order-form', { plan: "Diamond"}]); break;
      case "seller": this.router.navigate(['/seller-order-form']); break;
    }
  }
}
