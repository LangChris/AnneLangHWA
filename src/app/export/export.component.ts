import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  

  orders: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getOrders().subscribe(
      data => { 
        this.orders = data;
        
        for(var i=0; i< this.orders.length; i++) {
          this.orders[i]['plan'] = this.orders[i]['plan'].replace(/_/g, " ");
          this.orders[i]['homeType'] = this.orders[i]['homeType'].replace(/_/g, " ");
        }
      },
      error => console.log(error)
      );
  }

  ExportToExcel() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Orders.xlsx');  
  }  

}
