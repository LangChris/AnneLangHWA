import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const endpoints = {
  order: "/assets/database/place-order.php",
  sellerOrder: "/assets/database/place-seller-order.php",
  getOrders: "/assets/database/get-orders.php",
  updateOrder: "/assets/database/update-order.php",
  deleteOrder: "/assets/database/delete-order.php",
  enterOrder: "/assets/database/enter-order.php",
  getPromo: "/assets/database/get-promo.php",
  getPlans: "/assets/database/get-plans.php",
  getPlanOptions: "/assets/database/get-plan-options.php",
  getOptionalCoverage: "/assets/database/get-optional-coverage.php"
};

@Injectable()
export class DatabaseService {

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

  // Enter Order
  enterOrder(id: any) {
    return this.http.put(endpoints.enterOrder, id );
  }

  // Delete Order
  deleteOrder(id: any) {
    return this.http.post(endpoints.deleteOrder, id );
  }

  // Get Promo
  getPromo() {
    return this.http.get(endpoints.getPromo);
  }

  // Get Plans
  getPlans() {
    return this.http.get(endpoints.getPlans);
  }

  // Get Plan Options
  getPlanOptions() {
    return this.http.get(endpoints.getPlanOptions);
  }

  // Get Optional Coverage
  getOptionalCoverage() {
    return this.http.get(endpoints.getOptionalCoverage);
  }

}
