import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../dashboard.component'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import { DatePipe } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { DatabaseService } from '../../services/database.service';
import * as MultiSelect from '../../../assets/multi-select-umd';

@Component({
  selector: 'dashboard-edit',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.css']
})
export class EditOrdersComponent implements OnInit {

  editForm = new FormGroup({
    orderId: new FormControl('Select Order'),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    plan: new FormControl('Select One'),
    years: new FormControl(),
    homeType: new FormControl(),
    addressLine: new FormControl('', [Validators.maxLength(200)]),
    city: new FormControl('', [Validators.maxLength(50)]),
    state: new FormControl('', [Validators.maxLength(2)]),
    zip: new FormControl('', [Validators.maxLength(5)]),
    buyerName: new FormControl(),
    buyerEmail: new FormControl(),
    buyerPhone: new FormControl(),
    sellerName: new FormControl(),
    sellerEmail: new FormControl(),
    sellerPhone: new FormControl(),
    closeStartDate: new FormControl(),
    optionalCoverage: new FormControl([]),
    hvacCoverage: new FormControl('No'),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    realtorCompany: new FormControl(),
    realtorZip: new FormControl(),
    titleAgentEmail: new FormControl(),
    promo: new FormControl(),
    specialRequest: new FormControl(),
    createdDate: new FormControl()
  });

  multiSelect = null;

  constructor(private global: GlobalService, private database: DatabaseService, public dashboard: DashboardComponent, private datePipe: DatePipe) { }

  ngOnInit() {
    this.global.setShowPortal(false);

    this.editForm.controls.orderId.valueChanges.subscribe(value => {
      let table = document.getElementsByTagName('table');
      table[0].style.width = "auto";
      setTimeout(()=>{
        if(this.editForm.controls.orderId.value != 'Select Order') {
          this.dashboard.showSuccess = false;
          this.dashboard.showError = false;
          for(var i = 0; i < this.global.getOrders.length; i++) {
            if(this.global.getOrders[i]['id'] == value) {
              this.updateForm(this.global.getOrders[i]);
            }
          }
        }
      }, 100);
    });

  }

  updateForm(order: any) {
    this.editForm.controls.name.setValue(order['name']);
    this.editForm.controls.email.setValue(order['email']);
    this.editForm.controls.plan.setValue(order['plan']);
    this.editForm.controls.years.setValue(order['years']);
    this.editForm.controls.homeType.setValue(order['home_type']);
    this.editForm.controls.addressLine.setValue(order['address_line']);
    this.editForm.controls.city.setValue(order['city']);
    this.editForm.controls.state.setValue(order['state']);
    this.editForm.controls.zip.setValue(order['zip']);
    this.editForm.controls.buyerName.setValue(order['buyer_name']);
    this.editForm.controls.buyerEmail.setValue(order['buyer_email']);
    this.editForm.controls.buyerPhone.setValue(order['buyer_phone']);
    this.editForm.controls.sellerName.setValue(order['seller_name']);
    this.editForm.controls.sellerEmail.setValue(order['seller_email']);
    this.editForm.controls.sellerPhone.setValue(order['seller_phone']);
    this.editForm.controls.closeStartDate.setValue(this.datePipe.transform(order['close_start_date'], 'yyyy-MM-dd'));
    let options = [];
    let selectedOptions = [];
    for(var option = 0; option < this.global.getOptionalCoverage.length; option++) {
      options.push(this.global.getOptionalCoverage[option].option);
    }

    if(order['optional_coverage'] != null) {
      selectedOptions = order['optional_coverage'].split(", ");            
    }

    this.editForm.controls.optionalCoverage.setValue(selectedOptions);
    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;

    for(var j = 0; j < optionalCoverageSelect.options.length; j++) {
        optionalCoverageSelect.options[j].selected = selectedOptions.indexOf(optionalCoverageSelect.options[j].text) >= 0;
    }

    if(this.multiSelect == null) {
      this.multiSelect = new (MultiSelect as any)('.multi-select', {
        items: options,
        current: selectedOptions
      });
    } else {
      let result = document.getElementById('multi-select').getElementsByClassName('si-result')[0];
      let list = document.getElementById('multi-select').getElementsByClassName('si-list')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');

      if(selectedOptions.length == 0) {
        result.classList.remove('si-selection');
        result.innerHTML = "Select items";
      } else {
        if(selectedOptions.length == 1) {
          result.innerHTML = selectedOptions[0];
        } else {
          result.innerHTML = selectedOptions[0] + " (+" + (selectedOptions.length - 1) + " more)" ;
        }
      }
      for(var i  = 0; i < list.length; i++) {
        if(selectedOptions.indexOf(list[i].innerHTML) >= 0) {
          if(!list[i].classList.contains('si-selected')) {
            list[i].classList.add('si-selected');
            this.multiSelect.options.items.set(i, {value: list[i].innerHTML, selected: true});
          }
        } else {
          if(list[i].classList.contains('si-selected')) {
            list[i].classList.remove('si-selected');
            this.multiSelect.options.items.set(i, {value: list[i].innerHTML});
          }
        }
      }

      this.multiSelect.options.current = selectedOptions;
      
    }
    
    this.multiSelect.on('change', function (e) {
        var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
        for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
            optionalCoverageSelect.options[i].selected = this.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
        }
    });

    for(let i = 0; i < this.global.getSpecialRequest.length; i++) {
      var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
      specialRequest.checked = false;
    }

    if(order['special_request'] != null) {
      let selectedRequests = order['special_request'].split(", ");
      for(let i = 0; i < this.global.getSpecialRequest.length; i++) {
        var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
        let index = selectedRequests.indexOf(this.global.getSpecialRequest[i]);
        specialRequest.checked = index >= 0 ? true : false;
      }
      this.editForm.controls.specialRequest.setValue(selectedRequests);
    }

    this.editForm.controls.hvacCoverage.setValue(order['hvac_coverage']);
    this.editForm.controls.realtorName.setValue(order['realtor_name']);
    this.editForm.controls.realtorEmail.setValue(order['realtor_email']);
    this.editForm.controls.realtorCompany.setValue(order['realtor_company']);
    this.editForm.controls.realtorZip.setValue(order['realtor_zip']);
    this.editForm.controls.titleAgentEmail.setValue(order['title_agent_email']);
    this.editForm.controls.promo.setValue(order['promo']);
    this.editForm.controls.createdDate.setValue(this.datePipe.transform(order['created_date'], 'yyyy-MM-dd'));
  }

  resetForm() {
    if(this.global.getOrders && this.global.getOrders.length > 0){
      let orderSelect = document.getElementById('order-id') as HTMLSelectElement;
      if(orderSelect != null) {
        orderSelect.selectedIndex = 0;
        this.editForm.controls.orderId.setValue('Select Order');
      }
      
      this.global.updateOrders();
    }
  }

  updateOrder() {
    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
    var selectedOptions = [];
    for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
      if(optionalCoverageSelect.options[i].selected) {
        selectedOptions.push(optionalCoverageSelect.options[i].text);
      }
    }

    this.editForm.controls.optionalCoverage.setValue(selectedOptions);

    let selectedRequests = [];
    for(let i = 0; i < this.global.getSpecialRequest.length; i++) {
      var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
      if(specialRequest.checked) {
        selectedRequests.push(this.global.getSpecialRequest[i]);
      }
    }

    this.editForm.controls.specialRequest.setValue(selectedRequests);

    return this.database.updateOrder(this.editForm).subscribe(
      response => {
        this.dashboard.showSuccess = true;
        this.global.updateOrders();
      },
      error => {
        this.dashboard.showError = true;
      }
    );
  }

  deleteOrder(id) {
    return this.database.deleteOrder(id).subscribe(
      response => {
        this.resetForm();
        this.dashboard.showSuccess = true;
      },
      error => {
        this.resetForm();
        this.dashboard.showError = true;
      }
    );
  }

}
