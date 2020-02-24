import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AdminComponent } from '../admin.component';
import { PHPService } from '../../services/php.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  

  constructor(public admin: AdminComponent, private php: PHPService) { }

  showFilters: boolean = false;
  filename: string = "Orders";
  extension: string = "xlsx";

  ngOnInit() {
    let sort = document.getElementById('sort') as HTMLSelectElement;
    sort.selectedIndex = sort.options[0].value == this.admin.sortDirection ? 0 : 1;
    setTimeout(()=>{
      for(var i = 0; i < this.admin.orders.length; i++) {
        if(this.admin.orders[i]['entered'] == 1) {
          let enterOrder = document.getElementById('order-entered-' + this.admin.orders[i]['id']);
          enterOrder.style.display = "block";
        }
      }
    }, 100);
  }

  updateFilename(event) {
    setTimeout(()=>{
      let filenameText = document.getElementById('filename') as HTMLInputElement;
      this.filename = filenameText.value;
    }, 100);
  }

  toggleFilters() {
    this.showFilters = this.showFilters ? false : true;
  }

  filter() {
    let sort = document.getElementById('sort') as HTMLSelectElement;
    let timeline = document.getElementById('timeline') as HTMLSelectElement;
    let plan = document.getElementById('plan') as HTMLSelectElement;
    let homeType = document.getElementById('home-type') as HTMLSelectElement;

    if(this.showFilters) {
      this.admin.filterOrders(sort.value, timeline.value, plan.value, homeType.value);
    } else {
      this.admin.filterOrders(sort.value, "all", "all", "all");
    }
  }

  ExportToExcel() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement, );  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, this.filename + "." + this.extension);  
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
