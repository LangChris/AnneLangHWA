import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const endpoints = {
  order: "/assets/place-order.php",
  sellerOrder: "/assets/place-seller-order.php"
};

@Injectable()
export class EmailService {

  constructor(private http: HttpClient) { }

  // Place a new Order
  placeOrder(formGroup: FormGroup) {
    return this.http.post(endpoints.order, formGroup.value );
  }

  // Place a new Seller Order
  placeSellerOrder(formGroup: FormGroup) {
    return this.http.post(endpoints.sellerOrder, formGroup.value );
  }
}
