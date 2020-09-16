import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public global: GlobalService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    if(!this.global.testing) {
      //HWA API
      this.global.hwaGetPlans();
      this.global.hwaGetSettings();
      this.global.hwaGetOptionalCoverages();
      this.global.hwaGetSpecialRequests();
    } else {
      this.global.setTestData();
    }
    setTimeout(()=>{
      this.titleService.setTitle(this.global.settings.webpageTitle);
    },200);
  }

  priceStyle() {
    return {
      'text-decoration': this.global.promo != null && this.global.promo.type == 'Money Off' ? 'line-through' : 'none',
      'text-decoration-color': this.global.promo != null && this.global.promo.type == 'Money Off' ? '#eb5e17' : 'orange',
      'font-size': this.global.promo != null && this.global.promo.type == 'Money Off' ? '25px' : '30px'
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
      case "gold": this.router.navigate(['/order/buyer', { plan: "Gold"}]); break;
      case "platinum": this.router.navigate(['/order/buyer', { plan: "Platinum"}]); break;
      case "diamond": this.router.navigate(['/order/buyer', { plan: "Diamond"}]); break;
      case "seller": this.router.navigate(['/order/seller']); break;
    }
  }
}
