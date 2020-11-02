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
import { ClaimsComponent } from './claims/claims.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './dashboard/main/main.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { EditOrdersComponent } from './dashboard/edit-orders/edit-orders.component';
import { ViewOrdersComponent } from './dashboard/view-orders/view-orders.component';
import { GlobalService } from './services/global.service';
import { DatabaseService } from './services/database.service';
import { DatePipe } from '@angular/common';
import { AccordionComponent } from './global/accordion/accordion.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "claims",
    component: ClaimsComponent
  },
  {
    path: "order/buyer",
    component: OrderFormComponent
  },
  {
    path: "order/seller",
    component: SellerOrderFormComponent
  },
  {
    path: "login",
    component: DashboardComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
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
    LoginComponent,
    ViewOrdersComponent,
    EditOrdersComponent,
    DashboardComponent,
    SettingsComponent,
    ClaimsComponent,
    MainComponent,
    AccordionComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GlobalService, DatabaseService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
