import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AdminComponent } from '../admin.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  

  constructor(public admin: AdminComponent) { }

  ngOnInit() {
  }

  filter() {
    var filter = document.getElementById('filter') as HTMLSelectElement;
    this.admin.filterOrders(filter.value);
  }

  sort() {
    var sort = document.getElementById('sort') as HTMLSelectElement;
    this.admin.sortOrders(sort.value);
  }

  ExportToExcel() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement, );  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Orders.xlsx');  
  }  

  formatOrder(value: any) {
    if(value) {
      return value;
    }
    return "--";
  }

}
