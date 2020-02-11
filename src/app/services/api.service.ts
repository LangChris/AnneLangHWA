import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

//const baseUrl = "http://localhost:8081/v1/api";
const baseUrl = "https://lang-apps.com/v1/api";

const endpoints = {
    orders: {
        post: "/order",
        get: "/orders",
        put: "/order",
        delete: "/order/"
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

    // Update A Order
    updateOrder(order: {}) {
        let httpOptions = {
            headers: new HttpHeaders({ 'content-type': 'application/json' })
        };

        return this.http.put(baseUrl + endpoints.orders.put, order, httpOptions )
    }

    // Get All Orders
    getOrders() {
        let httpOptions = {
            headers: new HttpHeaders({ 'content-type': 'application/json' })
        };
        
        return this.http.get(baseUrl + endpoints.orders.get, httpOptions )
    }

    // Delete Order
    deleteOrder(id: number) {
        let httpOptions = {
            headers: new HttpHeaders({ 'content-type': 'application/json' })
        };

        return this.http.delete(baseUrl + endpoints.orders.delete + id )
    }
}
