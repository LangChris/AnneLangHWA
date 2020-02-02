import { Component, OnInit } from '@angular/core';
import { EmailService } from '../services/email.service';
import { ApiService } from '../services/api.service';
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
    email: new FormControl('', [Validators.required]),
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
    realtorEmail: new FormControl()
  }); 

  pageProperties = {
    header: "HWA - Your Home Warranty Partner",
    subheader: "Give your clients the best with the only 13-month home warranty.",
    description: "Fill out the information below to place an order!"
  };

  showForm = true;

  constructor(private email: EmailService, private api: ApiService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit() {
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
    if(this.sellerOrderForm.valid) {
      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.sellerOrderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.sellerOrderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var hvacCoverage = document.getElementById('hvac-coverage') as HTMLSelectElement;
      this.sellerOrderForm.controls.hvacCoverage.setValue(hvacCoverage.value);

      return this.email.placeSellerOrder(this.sellerOrderForm).subscribe(response => {
        this.showForm = false;
        this.saveOrder();
      });
    }
  }

  saveOrder() {
    let name = this.sellerOrderForm.controls.name.value;
    let email = this.sellerOrderForm.controls.email.value;
    let plan = this.sellerOrderForm.controls.plan.value.toString().toUpperCase().replace(/ /g, "_");
    let homeType = this.sellerOrderForm.controls.homeType.value.toString().toUpperCase().replace(/ /g, "_");
    let address = {
      addressLine: this.sellerOrderForm.controls.addressLine.value,
      city: this.sellerOrderForm.controls.city.value,
      state: this.sellerOrderForm.controls.state.value,
      zip: this.sellerOrderForm.controls.zip.value,
    };
    let sellerName = this.sellerOrderForm.controls.sellerName.value;
    let sellerEmail = this.sellerOrderForm.controls.sellerEmail.value;
    let closeStartDate = this.sellerOrderForm.controls.closeStartDate.value;
    let hvacCoverage = this.sellerOrderForm.controls.hvacCoverage.value;
    let realtorName = this.sellerOrderForm.controls.realtorName.value;
    let realtorEmail = this.sellerOrderForm.controls.realtorEmail.value;
    let order =  {
      "name": name,
      "email": email,
      "plan": plan,
      "homeType": homeType,
      "address": address,
      "buyerName": null,
      "buyerEmail": null,
      "sellerName": sellerName,
      "sellerEmail": sellerEmail,
      "closeStartDate": closeStartDate,
      "optionalCoverage": null,
      "hvacCoverage": hvacCoverage,
      "realtorName": realtorName,
      "realtorEmail": realtorEmail,
      "titleAgentEmail": null,
      "promo": null
    };

    return this.api.createOrder(order).subscribe(
      response => {},
      error => console.log(error)
    );
}

}
