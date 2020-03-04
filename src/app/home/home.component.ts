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
    this.updateGoldOptions();
    this.updatePlatinumOptions();
    this.updateDiamondOptions();
    this.global.setShowPortal(true);
  }

  updateGoldOptions() {
      var header = document.getElementById('gold-header');
      var table = document.getElementById('gold-table');
      var price = document.getElementById('gold-price');
      var discount = document.getElementById('gold-discount');
      
      header.innerHTML = this.global.getPlans.gold.header;
      price.innerHTML = "$" + this.global.getPlans.gold.price.toFixed(2);
      discount.innerHTML = this.global.getPlans.gold.discount;
      
      if(this.global.getPromo.active) {
          price.style.textDecoration = "line-through";
          price.style.fontSize = "25px";
          var promoPrice = document.getElementById('gold-price-promo');
          promoPrice.innerHTML = "$" + (this.global.getPlans.gold.price - this.global.getPromo.amount).toFixed(2);
      }
      
      for(var i = 0; i < this.global.getPlans.gold.options.length; i++) {
          table.innerHTML += "<li>&#10004;" + this.global.getPlans.gold.options[i] + "</li>";
      }
  }

  updatePlatinumOptions() {
      var header = document.getElementById('platinum-header');
      var table = document.getElementById('platinum-table');
      var price = document.getElementById('platinum-price');
      var discount = document.getElementById('platinum-discount');
      
      header.innerHTML = this.global.getPlans.platinum.header;
      price.innerHTML = "$" + this.global.getPlans.platinum.price.toFixed(2);
      discount.innerHTML = this.global.getPlans.platinum.discount;
      
      if(this.global.getPromo.active) {
          price.style.textDecoration = "line-through";
          price.style.fontSize = "25px";
          var promoPrice = document.getElementById('platinum-price-promo');
          promoPrice.innerHTML = "$" + (this.global.getPlans.platinum.price - this.global.getPromo.amount).toFixed(2);
      }
      
      for(var i = 0; i < this.global.getPlans.gold.options.length; i++) {
          table.innerHTML += "<li>&#10004;" + this.global.getPlans.gold.options[i] + "</li>";
      }
      
      for(i = 0; i < this.global.getPlans.platinum.options.length; i++) {
          table.innerHTML += "<li>&#10004;" + this.global.getPlans.platinum.options[i] + "</li>";
      }
  }

  updateDiamondOptions() {
      var header = document.getElementById('diamond-header');
      var table = document.getElementById('diamond-table');
      var tableExtra = document.getElementById('diamond-table-extra');
      var price = document.getElementById('diamond-price');
      var discount = document.getElementById('diamond-discount');
      
      header.innerHTML = this.global.getPlans.diamond.header;
      price.innerHTML = "$" + this.global.getPlans.diamond.price.toFixed(2);
      discount.innerHTML = this.global.getPlans.diamond.discount;
      
      if(this.global.getPromo.active) {
          price.style.textDecoration = "line-through";
          price.style.fontSize = "25px";
          var promoPrice = document.getElementById('diamond-price-promo');
          promoPrice.innerHTML = "$" + (this.global.getPlans.diamond.price - this.global.getPromo.amount).toFixed(2);
      }
      
      for(var i = 0; i < this.global.getPlans.gold.options.length; i++) {
          table.innerHTML += "<li>&#10004;" + this.global.getPlans.gold.options[i] + "</li>";
      }
      
      for(i = 0; i < this.global.getPlans.platinum.options.length; i++) {
          table.innerHTML += "<li>&#10004;" + this.global.getPlans.platinum.options[i] + "</li>";
      }
      
      for(i = 0; i < this.global.getPlans.diamond.options.length; i++) {
          tableExtra.innerHTML += "<li>&#10004;" + this.global.getPlans.diamond.options[i] + "</li>";
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
