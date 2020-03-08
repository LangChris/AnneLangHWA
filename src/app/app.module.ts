import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './global/navbar/navbar.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { SellerOrderFormComponent } from './seller-order-form/seller-order-form.component';
import { PromoComponent } from './global/promo/promo.component';
import { FooterComponent } from './global/footer/footer.component';
import { AdminComponent } from './admin/admin.component';

import { GlobalService } from './services/global.service';
import { DatabaseService } from './services/database.service';
import { LoginService } from './services/login.service';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './admin/login/login.component';
import { ViewOrdersComponent } from './admin/view-orders/view-orders.component';
import { EditOrdersComponent } from './admin/edit-orders/edit-orders.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SettingsComponent } from './admin/settings/settings.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "order-form",
    component: OrderFormComponent
  },
  {
    path: "seller-order-form",
    component: SellerOrderFormComponent
  },
  {
    path: "admin-portal",
    component: AdminComponent
  },
  {
    path: "**",
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    OrderFormComponent,
    SellerOrderFormComponent,
    PromoComponent,
    FooterComponent,
    AdminComponent,
    LoginComponent,
    ViewOrdersComponent,
    EditOrdersComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GlobalService, DatabaseService, LoginService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
