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
  filename: string = this.global.getGeneralSettings.defaultFilename;
  extension: string = "xlsx";
  enteredOrders = [];

  ngOnInit() {
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
      return value;
    }
    return "--";
  }

  showOrderEntered(show: boolean, id: any) {
    let enterOrder = document.getElementById('order-entered-' + id);
    for(var i = 0; i < this.dashboard.orders.length; i++) {
      if(this.dashboard.orders[i]['id'] == id) {
        if(this.dashboard.orders[i]['entered'] == 1) {
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

  orderEntered(id: any) {
    let index;
    for(var i = 0; i < this.dashboard.orders.length; i++) {
      if(this.dashboard.orders[i]['id'] == id && this.dashboard.orders[i]['entered'] == 0) {
        index = i;
        if(!this.global.testing) {
          this.database.enterOrder(id).subscribe(
            response => {
              this.dashboard.orders[index]['entered'] = 1;
              let enterOrder = document.getElementById('order-entered-' + id);
              enterOrder.style.display = "block";
              this.enteredOrders.push(this.dashboard.orders[index]);
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.dashboard.orders[index]['entered'] = 1;
          let enterOrder = document.getElementById('order-entered-' + id);
          enterOrder.style.display = "block";
          this.enteredOrders.push(this.dashboard.orders[index]);
        }
      }
    }
  }

  updateEnteredOrders() {
    setTimeout(()=>{
      this.enteredOrders = [];
      for(var i = 0; i < this.dashboard.orders.length; i++) {
        if(this.dashboard.orders[i]['entered'] == 1) {
          let enterOrder = document.getElementById('order-entered-' + this.dashboard.orders[i]['id']);
          enterOrder.style.display = "block";
          this.enteredOrders.push(this.dashboard.orders[i]);
        }
      }
    }, 200);
  }

}
