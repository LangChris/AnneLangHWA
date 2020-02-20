import { Component, OnInit } from '@angular/core';
import { PHPService } from '../services/php.service';
import { ApiService } from '../services/api.service';
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
    homeType: new FormControl(),
    addressLine: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zip: new FormControl(),
    sellerName: new FormControl(),
    sellerEmail: new FormControl(),
    startDate: new FormControl(),
    hvacCoverage: new FormControl(),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    createdDate: new FormControl()
  }); 

  pageProperties = {
    header: "HWA - Your Home Warranty Partner",
    subheader: "Give your clients the best with the only 13-month home warranty.",
    description: "Fill out the information below to place an order!"
  };

  showForm = true;
  validateName = false;
  validateEmail = false;

  constructor(private php: PHPService, private global: GlobalService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

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

  sendEmail() {
    this.validateName = true;
    this.validateEmail = true;
    if(this.sellerOrderForm.valid) {
      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.sellerOrderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.sellerOrderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var hvacCoverage = document.getElementById('hvac-coverage') as HTMLSelectElement;
      this.sellerOrderForm.controls.hvacCoverage.setValue(hvacCoverage.value);

      this.sellerOrderForm.controls.createdDate.setValue(new Date());

      return this.php.placeSellerOrder(this.sellerOrderForm).subscribe(response => {
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

}
