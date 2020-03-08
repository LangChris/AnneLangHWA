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

  displayPromoType(type: string) {
    return this.global.getPromo.type == type ? true : false;
  }

}
