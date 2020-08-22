import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { GlobalService } from '../services/global.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-seller-order-form',
  templateUrl: './seller-order-form.component.html',
  styleUrls: ['./seller-order-form.component.css']
})
export class SellerOrderFormComponent implements OnInit {

  sellerOrderForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    plan: new FormControl(),
    years: new FormControl('13 Months'),
    homeType: new FormControl(),
    addressLine: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zip: new FormControl(),
    specialRequest: new FormControl(),
    sellerName: new FormControl(),
    sellerEmail: new FormControl(),
    sellerPhone: new FormControl(),
    startDate: new FormControl('', [Validators.required]),
    hvacCoverage: new FormControl(),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    realtorCompany: new FormControl(),
    realtorZip: new FormControl(),
    createdDate: new FormControl(),
    sendEmail: new FormControl(),
    adminName: new FormControl(),
    adminEmail: new FormControl(),
    orderTotal: new FormControl()
  }); 

  showForm = true;
  validateName = false;
  validateEmail = false;
  validateDate = false;

  total = 'FREE';

  progressStep = 1;

  constructor(private database: DatabaseService, public global: GlobalService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.global.setShowPortal(false);

    this.sellerOrderForm.controls.name.valueChanges.subscribe(value => {
      if(value) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid #ccc";
        this.validateName = false;
      }
    });

    this.sellerOrderForm.controls.email.valueChanges.subscribe(value => {
      if(this.sellerOrderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid #ccc";
        this.validateEmail = false;
      }
    });

    this.sellerOrderForm.controls.hvacCoverage.valueChanges.subscribe(value => {
      if(this.sellerOrderForm.controls.hvacCoverage.value == 'Yes') {
        this.total = '$50';
      } else {
        this.total = 'FREE';
      }
    });

    if(this.showForm) {
      setTimeout(()=>{
        var plan = document.getElementById('plan') as HTMLSelectElement;
        plan.selectedIndex = 0;

        var homeType = document.getElementById('home-type-sf') as HTMLInputElement;
        homeType.checked = true;

        var hvacCoverage = document.getElementById('hvac-coverage') as HTMLSelectElement;
        hvacCoverage.selectedIndex = 0;
      }, 100);
    }
  }

  submitOrder() {
    if(this.sellerOrderForm.valid) {

      let selectedSpecialRequests = [];
      for(let i = 0; i < this.global.getSpecialRequest.length; i++) {
        var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
        if(specialRequest.checked) {
          selectedSpecialRequests.push(this.global.getSpecialRequest[i]);
        }
      }
      
      this.sellerOrderForm.controls.specialRequest.setValue(selectedSpecialRequests);

      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.sellerOrderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.sellerOrderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var hvacCoverage = document.getElementById('hvac-coverage') as HTMLSelectElement;
      this.sellerOrderForm.controls.hvacCoverage.setValue(hvacCoverage.value);

      let today = new Date;
      this.sellerOrderForm.controls.createdDate.setValue(today);
      this.sellerOrderForm.controls.sendEmail.setValue(this.global.getGeneralSettings.sendEmail);
      this.sellerOrderForm.controls.adminName.setValue(this.global.getGeneralSettings.owner);
      this.sellerOrderForm.controls.adminEmail.setValue(this.global.getGeneralSettings.email);
      this.sellerOrderForm.controls.orderTotal.setValue(this.total);

      return this.database.placeSellerOrder(this.sellerOrderForm).subscribe(response => {
        this.showForm = false;
      });
    } else {
      if(!this.sellerOrderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid crimson";
        var location = this.getElementLocation(email);
        window.scrollTo(location.left, location.top);
      }
      if(!this.sellerOrderForm.controls.name.valid) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid crimson";
        var location = this.getElementLocation(name);
        window.scrollTo(location.left, location.top);
      }
    }
  }

  getElementLocation(element) {
    var rect = element.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  makeProgressStep(direction) {
    switch(direction) {
      case "PREV": this.progressStep--; break;
      case "NEXT": { 
        if(this.progressStep == 1) {
          this.validateName = true;
          this.validateEmail = true;
        } else if(this.progressStep == 3) {
          this.validateDate = true;
        }
        
        if( (this.progressStep != 1 && this.progressStep != 3) || (this.progressStep == 1 && this.sellerOrderForm.controls.email.valid && this.sellerOrderForm.controls.name.valid) || this.sellerOrderForm.valid) {
          this.progressStep++; 
        } else {
          if(!this.sellerOrderForm.controls.email.valid) {
            var email = document.getElementById('email') as HTMLInputElement;
            email.style.border = "1px solid crimson";
            var location = this.getElementLocation(email);
            window.scrollTo(location.left, location.top);
          }
          if(!this.sellerOrderForm.controls.name.valid) {
            var name = document.getElementById('name') as HTMLInputElement;
            name.style.border = "1px solid crimson";
            var location = this.getElementLocation(name);
            window.scrollTo(location.left, location.top);
          }
          if(this.progressStep == 3 && !this.sellerOrderForm.controls.startDate.valid) {
            var startDate = document.getElementById('startDate') as HTMLInputElement;
            name.style.border = "1px solid crimson";
            var location = this.getElementLocation(startDate);
            window.scrollTo(location.left, location.top);
          }
        }
      } break;
    }
  }

}
