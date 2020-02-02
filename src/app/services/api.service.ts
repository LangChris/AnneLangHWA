import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const baseUrl = "http://ec2-13-59-208-167.us-east-2.compute.amazonaws.com:8081/v1/api";

const endpoints = {
    orders: {
        post: "/order",
        get: "/orders"
    }
};

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) {}

    // Create A New Order
    createOrder(order: {}) {
        let httpOptions = {
            headers: new HttpHeaders({ 'content-type': 'application/json' })
        };

        return this.http.post(baseUrl + endpoints.orders.post, order, httpOptions )
    }

    // Get All Orders
    getOrders() {
        let httpOptions = {
            headers: new HttpHeaders({ 'content-type': 'application/json' })
        };
        
        return this.http.get(baseUrl + endpoints.orders.get, httpOptions )
    }
}
