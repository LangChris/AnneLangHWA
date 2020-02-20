import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AdminComponent } from '../admin.component';
import { PHPService } from '../../services/php.service';
import * as XLSX from 'xlsx';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  

  constructor(public admin: AdminComponent, private php: PHPService) { }

  ngOnInit() {
    setTimeout(()=>{
      for(var i = 0; i < this.admin.orders.length; i++) {
        if(this.admin.orders[i]['entered'] == 1) {
          let enterOrder = document.getElementById('order-entered-' + this.admin.orders[i]['id']);
          enterOrder.style.display = "block";
        }
      }
    }, 100);
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
      if(value.toString().substring(value.length - 2) == ", ") {
        value = value.toString().substring(0, value.length - 2);
      }
      return value;
    }
    return "--";
  }

  showOrderEntered(show: boolean, id: any) {
    let enterOrder = document.getElementById('order-entered-' + id);
    for(var i = 0; i < this.admin.orders.length; i++) {
      if(this.admin.orders[i]['id'] == id) {
        if(this.admin.orders[i]['entered'] == 1) {
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
    for(var i = 0; i < this.admin.orders.length; i++) {
      if(this.admin.orders[i]['id'] == id && this.admin.orders[i]['entered'] == 0) {
        index = i;
        if(!this.admin.testing) {
          this.php.enterOrder(id).subscribe(
            response => {
              this.admin.orders[index]['entered'] = 1;
              let enterOrder = document.getElementById('order-entered-' + id);
              enterOrder.style.display = "block";
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.admin.orders[index]['entered'] = 1;
          let enterOrder = document.getElementById('order-entered-' + id);
          enterOrder.style.display = "block";
        }
      }
    }
  }

}
