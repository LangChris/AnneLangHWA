import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { EmailService } from '../services/email.service';
import { ApiService } from '../services/api.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import * as MultiSelect from '../../assets/multi-select-umd';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  orderForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    plan: new FormControl(),
    homeType: new FormControl(),
    addressLine: new FormControl('', [Validators.maxLength(200)]),
    city: new FormControl('', [Validators.maxLength(50)]),
    state: new FormControl('', [Validators.maxLength(2)]),
    zip: new FormControl('', [Validators.maxLength(5)]),
    buyerName: new FormControl(),
    buyerEmail: new FormControl(),
    closeStartDate: new FormControl(),
    optionalCoverage: new FormControl([]),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    titleAgentEmail: new FormControl(),
    promo: new FormControl()
  }); 

  pageProperties = {
    header: "HWA - Your Home Warranty Partner",
    subheader: "Give your clients the best with the only 13-month home warranty.",
    description: "Fill out the information below to place an order!"
  };

  optionalCoverage = [
    { option: "Pool/Spa Combo", price: "$190.00/yr." },
    { option: "Additional Pool or Spa", price: "$190.00/yr." },
    { option: "Salt Water Pool (must purchase with Pool/Spa Combo)", price: "$345.00/yr." },
    { option: "Well Pump", price: "$100.00/yr." },
    { option: "Stand Alone Freezer", price: "$50.00/yr." },
    { option: "Second Refrigerator", price: "$35.00/yr." },
    { option: "Septic System/Sewage Ejector Pump and Septic Tank Pumping", price: "$75.00/yr." },
    { option: "External Water Line Repair", price: "$90.00/yr." },
    { option: "External Water Line + Sewer & Septic Line Repair", price: "$195.00/yr." },
    { option: "Washer/Dryer Package", price: "$85.00/yr." },
    { option: "Kitchen Refrigerator w/Ice Maker", price: "$50.00/yr." },
    { option: "Green Plus", price: "$70.00/yr." },
    { option: "Orange Plus", price: "$100.00/yr." },
  ];

  showForm = true;
  validPromo = false;

  constructor(private global: GlobalService, private route: ActivatedRoute, private email: EmailService, private api: ApiService, private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.orderForm.controls.name.valueChanges.subscribe(value => {
      if(value) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid #ccc";
      }
    });

    this.orderForm.controls.email.valueChanges.subscribe(value => {
      if(value) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid #ccc";
      }
    });

    if(this.showForm) {
      setTimeout(()=>{

        let selectedPlan = this.route.snapshot.paramMap.get('plan');
        var plan = document.getElementById('plan') as HTMLSelectElement;
        if(selectedPlan) {
          plan.value = selectedPlan.toLowerCase();
        } else {
          plan.selectedIndex = 0;
        }

        var homeType = document.getElementById('home-type-sf') as HTMLInputElement;
        homeType.checked = true;

        if(this.global.getPromo.active) {
          var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
          promoInput.value = this.global.getPromo.code;
          this.updatePromoStatus(null);
        }

        this.updateOptionalCoverageSelect();
      }, 100);
    }
  }

  updateOptionalCoverageSelect() {

    var optionalCoverageSelect = document.getElementById("optional-coverage") as HTMLSelectElement;
    optionalCoverageSelect.options.length = 1;
    
    var plan = document.getElementById('plan') as HTMLSelectElement;
    var options = [];

    for(var i = 0; i < this.optionalCoverage.length; i++) {
        if(plan.value == this.global.getPlans.platinum.header.toLowerCase()) {
            if(i != 9 && i != 10) {
                var option = document.createElement("option");
                option.text = this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price;
                option.value = this.optionalCoverage[i].option;
                optionalCoverageSelect.add(option);
                options.push(this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price);
            }
        } else if(plan.value === this.global.getPlans.diamond.header.toLowerCase()) {
            if(i != 9 && i != 10 && i != 12) {
                var option = document.createElement("option");
                option.text = this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price;
                option.value = this.optionalCoverage[i].option;
                optionalCoverageSelect.add(option);
                options.push(this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price);
            }
        } else {
            var option = document.createElement("option");
            option.text = this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price;
            option.value = this.optionalCoverage[i].option;
            optionalCoverageSelect.add(option);
            options.push(this.optionalCoverage[i].option + " - " + this.optionalCoverage[i].price);
        }
    }
    
    var multiSelect = new (MultiSelect as any)('.multi-select', {
    items: options,
    current: null,
    });
    multiSelect.on('change', function (e) {
        var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
        for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
            optionalCoverageSelect.options[i].selected = multiSelect.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
        }
    });
  }

  updatePromoStatus(event) {
    setTimeout(()=>{
      if(!this.global.getPromo.active) {
        this.validPromo = true;
      }

      var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
      var promoInputValue = promoInput.value;
      var promoStatus = document.getElementById('promo-status');
      if(promoInputValue) {
          if(this.global.getPromo.active && this.global.getPromo.code === promoInputValue.toUpperCase()) {
              promoInput.style.border = "1px solid green";
              promoStatus.style.color = "green";
              promoStatus.innerHTML = " &#10004; Valid";
              this.validPromo = true;
          } else {
              promoInput.style.border = "1px solid crimson";
              promoStatus.style.color = "crimson";
              promoStatus.innerHTML = " Invalid";   
              this.validPromo = false;
          } 
      } else {
          promoStatus.innerHTML = '';
          promoInput.style.border = "1px solid #ccc";
          this.validPromo = true;
      }
    }, 100);
    
  }

  sendEmail() {
    if(this.orderForm.valid) {
      var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
      var selectedOptions = [];
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          selectedOptions.push(optionalCoverageSelect.options[i].value);
        }
      }
      
      this.orderForm.controls.optionalCoverage.setValue(selectedOptions);
      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.orderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.orderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      return this.email.placeOrder(this.orderForm).subscribe(response => {
        this.showForm = false;
        this.saveOrder();
      });
    } else {
      if(!this.orderForm.controls.name.valid) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid crimson";
        name.style.color = "crimson";
      }
      if(!this.orderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid crimson";
        email.style.color = "crimson";
      }
    }
  }

  saveOrder() {
      let name = this.orderForm.controls.name.value;
      let email = this.orderForm.controls.email.value;
      let plan = this.orderForm.controls.plan.value.toString().toUpperCase().replace(/ /g, "_");
      let homeType = this.orderForm.controls.homeType.value.toString().toUpperCase().replace(/ /g, "_");
      let address = {
        addressLine: this.orderForm.controls.addressLine.value,
        city: this.orderForm.controls.city.value,
        state: this.orderForm.controls.state.value,
        zip: this.orderForm.controls.zip.value,
      };
      let buyerName = this.orderForm.controls.buyerName.value;
      let buyerEmail = this.orderForm.controls.buyerEmail.value;
      let closeStartDate = this.orderForm.controls.closeStartDate.value;
      let optionalCoverage = this.orderForm.controls.optionalCoverage.value.join(", ");
      let realtorName = this.orderForm.controls.realtorName.value;
      let realtorEmail = this.orderForm.controls.realtorEmail.value;
      let titleAgentEmail = this.orderForm.controls.titleAgentEmail.value;
      let promo = this.orderForm.controls.promo.value;
      let order =  {
        "name": name,
        "email": email,
        "plan": plan,
        "homeType": homeType,
        "address": address,
        "buyerName": buyerName,
        "buyerEmail": buyerEmail,
        "sellerName": null,
        "sellerEmail": null,
        "closeStartDate": closeStartDate,
        "optionalCoverage": optionalCoverage,
        "hvacCoverage": null,
        "realtorName": realtorName,
        "realtorEmail": realtorEmail,
        "titleAgentEmail": titleAgentEmail,
        "promo": promo
      };

      return this.api.createOrder(order).subscribe(
        response => {},
        error => console.log(error)
      );
  }

}
