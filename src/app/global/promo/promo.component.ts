import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {

  constructor(private global: GlobalService) { }

  ngOnInit() {
    this.updatePromo();
  }

  updatePromo() {
    if (this.global.getPromo.active) {
        var title = document.getElementById('promo-title');
        var subtitle = document.getElementById('promo-subtitle');
        var endDate = document.getElementById('promo-endDate');
        var code = document.getElementById('promo-code');
        
        title.innerHTML = this.global.getPromo.title;
        subtitle.innerHTML = this.global.getPromo.subtitle;
        endDate.innerHTML = this.global.getPromo.endDate;
        code.innerHTML = this.global.getPromo.code;
    } else {
        document.getElementById('promo').style.display = 'none';
    }
  }

}
