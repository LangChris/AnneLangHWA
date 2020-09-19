import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DashboardComponent } from '../dashboard.component';
import { DatabaseService } from '../../services/database.service';
import { GlobalService } from '../../services/global.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'dashboard-view',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;

  constructor(public global: GlobalService, public dashboard: DashboardComponent, private database: DatabaseService) { }

  showFilters: boolean = false;
  filename: string = "Orders";
  //filename: string = this.global.settings.defaultFilename;
  extension: string = "xlsx";
  enteredOrders = [];

  ngOnInit() {
    let sort = document.getElementById('sort') as HTMLSelectElement;
    this.dashboard.filterOrders(sort.value, "all", "all", "all", "all", "all", "all");
    this.updateEnteredOrders();
  }

  updateFilename(event) {
    setTimeout(()=>{
      let filenameText = document.getElementById('filename') as HTMLInputElement;
      this.filename = filenameText.value;
    }, 100);
  }

  toggleFilters() {
    this.showFilters = this.showFilters ? false : true;
    let dropdown = document.getElementById('filter-dropdown') as HTMLSpanElement;
    dropdown.className = this.showFilters ? 'open' : 'closed';
  }

  filter() {
    let sort = document.getElementById('sort') as HTMLSelectElement;
    let timeline = document.getElementById('timeline') as HTMLSelectElement;
    let plan = document.getElementById('plan') as HTMLSelectElement;
    let homeType = document.getElementById('home-type') as HTMLSelectElement;
    let entered = document.getElementById('entered') as HTMLSelectElement;
    let years = document.getElementById('years') as HTMLSelectElement;
    let realtor = document.getElementById('realtor') as HTMLSelectElement;

    if(this.showFilters) {
      this.dashboard.filterOrders(sort.value, timeline.value, plan.value, homeType.value, entered.value, years.value, realtor.value);
    } else {
      this.dashboard.filterOrders(sort.value, "all", "all", "all", "all", "all", "all");
    }

    this.updateEnteredOrders();
  }

  ExportToExcel() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement, );  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, this.filename + "." + this.extension);  
  }  

  formatOrder(value: any) {
    if(value && value != 0) {
      if(value.toString().substring(value.length - 2) == ", ") {
        value = value.toString().substring(0, value.length - 2);
      }
      if(value.toString() == value.toString().toUpperCase()) {
        let regex = /\_/gi;
        value = value.toString().replace(regex, " ");
        value = value.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
      }
      return value;
    }
    return "--";
  }

  showOrderEntered(show: boolean, id: any) {
    let enterOrder = document.getElementById('order-entered-' + id);
    for(var i = 0; i < this.dashboard.orders.length; i++) {
      if(this.dashboard.orders[i].orderId == id) {
        if(this.dashboard.orders[i].entered = true) {
          return;
        }
      }
    }
    if(show) {
      enterOrder.style.display = "block";
    } else {
      enterOrder.style.display = "none";
    }
  }

  enterOrder(order: any) {
    if(!order.entered && !this.global.testing) {
      this.database.HwaEnterOrder(order).subscribe(
        response => {
          order = response;
          let enterOrder = document.getElementById('order-entered-' + order.orderId);
          enterOrder.style.display = "block";
          this.enteredOrders.push(order);
          this.database.getOrders();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  updateEnteredOrders() {
    this.dashboard.getFilteredOrders();
    setTimeout(()=>{
      this.enteredOrders = [];
      for(var i = 0; i < this.dashboard.orders.length; i++) {
        if(this.dashboard.orders[i].entered == true) {
          let enterOrder = document.getElementById('order-entered-' + this.dashboard.orders[i].orderId);
          enterOrder.style.display = "block";
          this.enteredOrders.push(this.dashboard.orders[i]);
        }
      }
    }, 200);
  }

}
