import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const hwa = {
  url: "https://hwa-api.servehttp.com:8443/v1/api",
  endpoints: {
    health: "/health",
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
    updatePlans: "/plans",
    getPromo: "/promo",
    updatePromo: "/promo",
    getSettings: "/settings",
    updateSettings: "/settings",
    getSpecialRequests: "/special-requests",
    getOptionalCoverages: "/optional-coverages",
    updateSpecialRequests: "/special-requests",
    updateOptionalCoverages: "/optional-coverages"
  }
};

@Injectable()
export class DatabaseService {

  constructor(private http: HttpClient) { }

  // HWA API Health Check
  HwaApiHealthCheck() {
    return this.http.get(hwa.url + hwa.endpoints.health);
  }

  // HWA Login
  HwaLogin(login: any) {  
    return this.http.post(hwa.url + hwa.endpoints.login, login);
  }

  // HWA Register User
  HwaRegisterUser(user: any) {  
    return this.http.post(hwa.url + hwa.endpoints.registerUser, user);
  }
  
  // HWA Orders
  HwaOrders(token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.get(hwa.url + hwa.endpoints.getOrders, httpOptions);
  }

  // HWA Users
  HwaUsers(token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.get(hwa.url + hwa.endpoints.getUsers, httpOptions);
  }

  // HWA Password Reset
  HwaPasswordReset(username: any) {
    return this.http.get(hwa.url + hwa.endpoints.resetPassword + "/" + username);
  }

  // HWA Plans
  HwaPlans() {
    return this.http.get(hwa.url + hwa.endpoints.getPlans);
  }

  // HWA Update Plans
  HwaUpdatePlans(plans: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updatePlans, plans, httpOptions);
  }

  // HWA Update Optional Coverages
  HwaUpdateOptionalCoverages(coverages: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updateOptionalCoverages, coverages, httpOptions);
  }

  // HWA Update Special Requests
  HwaUpdateSpecialRequests(requests: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updateSpecialRequests, requests, httpOptions);
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
  HwaDeleteOrder(id: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.delete(hwa.url + hwa.endpoints.deleteOrder + "/" + id, httpOptions);
  }

  // HWA Update Order
  HwaUpdateOrder(order: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updateOrder, order, httpOptions);
  }

  // HWA Update User
  HwaUpdateUser(formGroup: FormGroup) {
    formGroup.controls.password.setValue(btoa(formGroup.controls.password.value));
    return this.http.put(hwa.url + hwa.endpoints.updateUser, formGroup.value);
  }

  // HWA Update Settings
  HwaUpdateSettings(formGroup: FormGroup, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updateSettings, formGroup.value, httpOptions);
  }

  // HWA Update Promo
  HwaUpdatePromo(formGroup: FormGroup, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.updatePromo, formGroup.value, httpOptions);
  }

  // HWA Enter Order
  HwaEnterOrder(order: any, token) {
    let httpOptions = {
      headers: new HttpHeaders({ 'token': token })
    };

    return this.http.put(hwa.url + hwa.endpoints.enterOrder, order, httpOptions);
  }

  // HWA Place Order
  HwaPlaceOrder(order: any) {
    return this.http.post(hwa.url + hwa.endpoints.placeOrder, order);
  }

}
