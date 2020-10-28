import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const hwa = {
  url: "https://hwa-api.servehttp.com:8443/v1/api",
  endpoints: {
    login: "/login",
    importOrders: "/import/orders",
    getOrders: "/orders",
    deleteOrder: "/order",
    updateOrder: "/order",
    updateUser: "/user",
    enterOrder: "/order/enter",
    placeOrder: "/order",
    getUsers: "/users",
    registerUser: "/user",
    resetPassword: "/user/password-reset",
    getPlans: "/plans",
    getPromo: "/promo",
    updatePromo: "/promo",
    getSettings: "/settings",
    updateSettings: "/settings",
    getSpecialRequests: "/special-requests",
    getOptionalCoverages: "/optional-coverages",
    sendBuyerEmail: "/assets/email/email-buyer-order.php",
    sendSellerEmail: "/assets/email/email-seller-order.php"
  }
};

@Injectable()
export class DatabaseService {

  constructor(private http: HttpClient) { }

  // HWA Login
  HwaLogin(login: any) {  
    return this.http.post(hwa.url + hwa.endpoints.login, login);
  }

  // HWA Register User
  HwaRegisterUser(user: any) {  
    return this.http.post(hwa.url + hwa.endpoints.registerUser, user);
  }
  

  // HWA Import Orders
  HwaImportOrders(orders: any) {
    return this.http.post(hwa.url + hwa.endpoints.importOrders, orders);
  }

  // HWA Orders
  HwaOrders(token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
  };

    return this.http.get(hwa.url + hwa.endpoints.getOrders, httpOptions);
  }

  // HWA Users
  HwaUsers() {
    return this.http.get(hwa.url + hwa.endpoints.getUsers);
  }

  // HWA Password Reset
  HwaPasswordReset(username: any) {
    return this.http.get(hwa.url + hwa.endpoints.resetPassword + "/" + username);
  }

  // HWA Plans
  HwaPlans() {
    return this.http.get(hwa.url + hwa.endpoints.getPlans);
  }

  // HWA Promo
  HwaPromo() {
    return this.http.get(hwa.url + hwa.endpoints.getPromo);
  }

  // HWA Settings
  HwaSettings() {
    return this.http.get(hwa.url + hwa.endpoints.getSettings);
  }

  // HWA Special Requests
  HwaSpecialRequests() {
    return this.http.get(hwa.url + hwa.endpoints.getSpecialRequests);
  }

  // HWA Optional Coverages
  HwaOptionalCoverages() {
    return this.http.get(hwa.url + hwa.endpoints.getOptionalCoverages);
  }

  // HWA Delete Order
  HwaDeleteOrder(id: any) {
    return this.http.delete(hwa.url + hwa.endpoints.deleteOrder + "/" + id);
  }

  // HWA Update Order
  HwaUpdateOrder(order: any) {
    return this.http.put(hwa.url + hwa.endpoints.updateOrder, order);
  }

  // HWA Update User
  HwaUpdateUser(formGroup: FormGroup) {
    return this.http.put(hwa.url + hwa.endpoints.updateUser, formGroup.value);
  }

  // HWA Update Settings
  HwaUpdateSettings(formGroup: FormGroup) {
    return this.http.put(hwa.url + hwa.endpoints.updateSettings, formGroup.value);
  }

  // HWA Update Promo
  HwaUpdatePromo(formGroup: FormGroup) {
    return this.http.put(hwa.url + hwa.endpoints.updatePromo, formGroup.value);
  }

  // HWA Enter Order
  HwaEnterOrder(order: any) {
    return this.http.put(hwa.url + hwa.endpoints.enterOrder, order);
  }

  // HWA Place Order
  HwaPlaceOrder(order: any) {
    return this.http.post(hwa.url + hwa.endpoints.placeOrder, order);
  }

  // Send Buyer Email
  sendBuyerEmail(formGroup: FormGroup) {
    return this.http.post(hwa.endpoints.sendBuyerEmail, formGroup.value);
  }

  // Send Seller Email
  sendSellerEmail(formGroup: FormGroup) {
    return this.http.post(hwa.endpoints.sendSellerEmail, formGroup.value);
  }

}
