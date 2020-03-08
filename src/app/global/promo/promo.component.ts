import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {

  constructor(public global: GlobalService) { }

  ngOnInit() {
    if(!this.global.testing) {
      this.global.updatePromo();
    }
  }

  displayPromo() {
    let today = new Date();
    let endDate = new Date(this.global.getPromo.endDate);
    let valid = this.global.getPromo.active && today <= endDate;
    return valid ? true : false;
  }

  displayPromoType(type: string) {
    return this.global.getPromo.type == type ? true : false;
  }

}
