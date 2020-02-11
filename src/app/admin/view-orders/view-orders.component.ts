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

  ExportToExcel() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Orders.xlsx');  
  }  

}
