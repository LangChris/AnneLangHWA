import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin.component'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import { DatePipe } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { DatabaseService } from '../../services/database.service';
import * as MultiSelect from '../../../assets/multi-select-umd';

@Component({
  selector: 'edit-orders',
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
    createdDate: new FormControl()
  });

  multiSelect = null;

  constructor(private global: GlobalService, private database: DatabaseService, public admin: AdminComponent, private datePipe: DatePipe) { }

  ngOnInit() {
    this.global.setShowPortal(false);

    this.editForm.controls.orderId.valueChanges.subscribe(value => {
      let table = document.getElementsByTagName('table');
      table[0].style.width = "auto";
      setTimeout(()=>{
      if(this.editForm.controls.orderId.value != 'Select Order') {
        this.admin.showSuccess = false;
        this.admin.showError = false;
      }
      for(var i = 0; i < this.admin.orders.length; i++) {
        if(this.admin.orders[i]['id'] == value) {
          this.editForm.controls.name.setValue(this.admin.orders[i]['name']);
          this.editForm.controls.email.setValue(this.admin.orders[i]['email']);
          this.editForm.controls.plan.setValue(this.admin.orders[i]['plan']);
          this.editForm.controls.years.setValue(this.admin.orders[i]['years']);
          this.editForm.controls.homeType.setValue(this.admin.orders[i]['home_type']);
          this.editForm.controls.addressLine.setValue(this.admin.orders[i]['address_line']);
          this.editForm.controls.city.setValue(this.admin.orders[i]['city']);
          this.editForm.controls.state.setValue(this.admin.orders[i]['state']);
          this.editForm.controls.zip.setValue(this.admin.orders[i]['zip']);
          this.editForm.controls.buyerName.setValue(this.admin.orders[i]['buyer_name']);
          this.editForm.controls.buyerEmail.setValue(this.admin.orders[i]['buyer_email']);
          this.editForm.controls.buyerPhone.setValue(this.admin.orders[i]['buyer_phone']);
          this.editForm.controls.sellerName.setValue(this.admin.orders[i]['seller_name']);
          this.editForm.controls.sellerEmail.setValue(this.admin.orders[i]['seller_email']);
          this.editForm.controls.sellerPhone.setValue(this.admin.orders[i]['seller_phone']);
          this.editForm.controls.closeStartDate.setValue(this.datePipe.transform(this.admin.orders[i]['close_start_date'], 'yyyy-MM-dd'));
          let options = [];
          let selectedOptions = [];
          for(var option = 0; option < this.global.getOptionalCoverage.length; option++) {
            options.push(this.global.getOptionalCoverage[option].option);
          }
          if(this.admin.orders[i]['optional_coverage'] != null) {
            selectedOptions = this.admin.orders[i]['optional_coverage'].split(", ");
            this.editForm.controls.optionalCoverage.setValue(selectedOptions);
            var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
            for(var j = 0; j < optionalCoverageSelect.options.length; j++) {
                optionalCoverageSelect.options[j].selected = selectedOptions.indexOf(optionalCoverageSelect.options[j].text) >= 0;
                if(optionalCoverageSelect.options[j].selected) {
                  selectedOptions.push(optionalCoverageSelect.options[j].text);
                }
            }
          }

          if(this.multiSelect == null) {
           this.multiSelect = new (MultiSelect as any)('.multi-select', {
              items: options,
              current: selectedOptions
            });
          } else {
            this.multiSelect.options.current = selectedOptions;
          }
          
          this.multiSelect.on('change', function (e) {
              var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
              for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
                  optionalCoverageSelect.options[i].selected = this.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
              }
          });
          this.editForm.controls.hvacCoverage.setValue(this.admin.orders[i]['hvac_coverage']);
          this.editForm.controls.realtorName.setValue(this.admin.orders[i]['realtor_name']);
          this.editForm.controls.realtorEmail.setValue(this.admin.orders[i]['realtor_email']);
          this.editForm.controls.realtorCompany.setValue(this.admin.orders[i]['realtor_company']);
          this.editForm.controls.realtorZip.setValue(this.admin.orders[i]['realtor_zip']);
          this.editForm.controls.titleAgentEmail.setValue(this.admin.orders[i]['title_agent_email']);
          this.editForm.controls.promo.setValue(this.admin.orders[i]['promo']);
          this.editForm.controls.createdDate.setValue(this.datePipe.transform(this.admin.orders[i]['created_date'], 'yyyy-MM-dd'));
        }
      }
    }, 100);
    });

  }

  resetForm() {
    if(this.admin.orders && this.admin.orders.length > 0){
      let orderSelect = document.getElementById('order-id') as HTMLSelectElement;
      orderSelect.selectedIndex = 0;
      this.editForm.controls.orderId.setValue('Select Order');

      this.admin.getOrders();
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

    return this.database.updateOrder(this.editForm).subscribe(
      response => {
        this.admin.showSuccess = true;
      },
      error => {
        this.admin.showError = true;
      }
    );
  }

  deleteOrder(id) {
    return this.database.deleteOrder(id).subscribe(
      response => {
        this.resetForm();
        this.admin.showSuccess = true;
      },
      error => {
        this.resetForm();
        this.admin.showError = true;
      }
    );
  }

}
