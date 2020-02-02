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
import { ExportComponent } from './export/export.component';

import { GlobalService } from './services/global.service';
import { EmailService } from './services/email.service';
import { ApiService } from './services/api.service';


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
    path: "export",
    component: ExportComponent
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
    ExportComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GlobalService, EmailService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
