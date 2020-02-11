import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';
import { PHPService } from '../services/php.service'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  orders: any;
  selectedOrder: any;

  display = {
    dashboard: true,
    view: false,
    edit: false
  };

  showError: boolean = false;
  showSuccess: boolean = false;


  constructor(private php: PHPService, public login: LoginService, private global: GlobalService) { }

  ngOnInit() {
    this.global.setShowPortal(false);
  }

  getOrders() {
    return this.php.getOrders().subscribe(
      data => { 
        this.orders = data;
        this.orders.sort((a,b) => a.id.localeCompare(b.id));
      },
      error => console.log(error)
      );
  }

  updateDisplay(view: boolean, edit: boolean, dashboard: boolean) {
    this.showError = false;
    this.showSuccess = false;

    this.display.view = view;
    this.display.edit = edit;
    this.display.dashboard = dashboard;
  }

  updateSort(sort) {
    if (sort.classList.contains('no-sort')) {
      sort.classList.remove('no-sort');
      sort.classList.add('asc');
      this.orders.sort((a,b) => a.name.localeCompare(b.name));
    } else if (sort.classList.contains('asc')) {
      sort.classList.remove('asc');
      sort.classList.add('desc');
      this.orders.reverse();
    } else if (sort.classList.contains('desc')) {
      sort.classList.remove('desc');
      sort.classList.add('no-sort');
      this.orders.sort((a,b) => a.id.localeCompare(b.id));
    }
    console.log(this.orders);
  }

}
