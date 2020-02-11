import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const endpoints = {
  order: "/assets/place-order.php",
  sellerOrder: "/assets/place-seller-order.php",
  getOrders: "/assets/get-orders.php",
  updateOrder: "/assets/update-order.php",
  deleteOrder: "/assets/delete-order.php"
};

@Injectable()
export class PHPService {

  constructor(private http: HttpClient) { }

  // Place a new Order
  placeOrder(formGroup: FormGroup) {
    return this.http.post(endpoints.order, formGroup.value );
  }

  // Place a new Seller Order
  placeSellerOrder(formGroup: FormGroup) {
    return this.http.post(endpoints.sellerOrder, formGroup.value );
  }

  // Get Orders
  getOrders() {
    return this.http.get(endpoints.getOrders);
  }

  // Update Order
  updateOrder(formGroup: FormGroup) {
    return this.http.put(endpoints.updateOrder, formGroup.value );
  }

  // Delete Order
  deleteOrder(formGroup: FormGroup) {
    return this.http.post(endpoints.deleteOrder, formGroup.controls.orderId.value );
  }

}
