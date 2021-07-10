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
    this.global.hwaGetPromo();
  }

  displayPromoType(type: string) {
    return this.global.promo.type == type ? true : false;
  }

}
