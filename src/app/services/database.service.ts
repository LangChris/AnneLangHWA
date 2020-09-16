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
  getOptionalCoverage: "/assets/database/get-optional-coverage.php",
  getSpecialRequest: "/assets/database/get-special-request.php",
  getGeneralSettings: "/assets/database/get-general-settings.php",
  updateGeneralSettings: "/assets/database/update-general-settings.php",
  updateSettings: "/assets/database/update-settings.php",
  getLogin: "/assets/database/get-login.php",
  saveUser: "/assets/database/save-user.php",
  resetPassword: "/assets/database/reset-password.php"
};

const hwa = {
  url: "https://hwa-api.servehttp.com:8443/v1/api",
  endpoints: {
    login: "/login",
    importOrders: "/import/orders",
    getOrders: "/orders",
    deleteOrder: "/order",
    updateOrder: "/order",
    getUsers: "/users",
    getPlans: "/plans",
    getPromo: "/promo",
    getSettings: "/settings",
    getSpecialRequests: "/special-requests",
    getOptionalCoverages: "/optional-coverages"
  }
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

  // Get Special Request
  getSpecialRequest() {
    return this.http.get(endpoints.getSpecialRequest);
  }

  // Get General Settings
  getGeneralSettings() {
    return this.http.get(endpoints.getGeneralSettings);
  }

  // Save General Settings
  saveGeneralSettings(formGroup: FormGroup) {
    return this.http.put(endpoints.updateGeneralSettings, formGroup.value);
  }

  // Save Settings
  saveSettings(formGroup: FormGroup) {
    return this.http.put(endpoints.updateSettings, formGroup.value);
  }

  // Get Users
  getUsers() {
    return this.http.get(endpoints.getLogin);
  }

  // Save User
  saveUser(user: any) {
    return this.http.post(endpoints.saveUser, user);
  }

  // Reset Password
  resetPassword(formGroup: FormGroup) {
    return this.http.post(endpoints.resetPassword, formGroup.value);
  }

  // HWA Login
  HwaLogin(login: any) {  
    return this.http.post(hwa.url + hwa.endpoints.login, login);
  }

  // HWA Import Orders
  HwaImportOrders(orders: any) {
    return this.http.post(hwa.url + hwa.endpoints.importOrders, orders);
  }

  // HWA Orders
  HwaOrders() {
    return this.http.get(hwa.url + hwa.endpoints.getOrders);
  }

  // HWA Users
  HwaUsers() {
    return this.http.get(hwa.url + hwa.endpoints.getUsers);
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
    return this.http.delete(hwa.url + hwa.endpoints.deleteOrder, id);
  }

  // HWA Update Order
  HwaUpdateOrder(order: any) {
    return this.http.put(hwa.url + hwa.endpoints.updateOrder, order);
  }

}
