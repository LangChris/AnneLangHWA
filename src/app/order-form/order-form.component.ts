import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
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
    email: new FormControl('', [Validators.required, Validators.email]),
    plan: new FormControl(),
    years: new FormControl('13 Months'),
    homeType: new FormControl(),
    addressLine: new FormControl('', [Validators.maxLength(200)]),
    city: new FormControl('', [Validators.maxLength(50)]),
    state: new FormControl('', [Validators.maxLength(2)]),
    zip: new FormControl('', [Validators.maxLength(5)]),
    buyerName: new FormControl(),
    buyerEmail: new FormControl(),
    buyerPhone: new FormControl(),
    closeStartDate: new FormControl(),
    optionalCoverage: new FormControl([]),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    realtorCompany: new FormControl(),
    realtorZip: new FormControl(),
    titleAgentEmail: new FormControl(),
    promo: new FormControl(),
    createdDate: new FormControl()
  }); 

  pageProperties = {
    header: "HWA - Your Home Warranty Partner",
    subheader: "Give your clients the best with the only 13-month home warranty.",
    description: "Fill out the information below to place an order!"
  };

  showForm = true;
  validPromo = false;
  validateName = false;
  validateEmail = false;

  total: number = 0;

  multiSelect: any;

  constructor(private global: GlobalService, private route: ActivatedRoute, private database: DatabaseService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.global.setShowPortal(false);
    
    this.orderForm.controls.name.valueChanges.subscribe(value => {
      if(value) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid #ccc";
        this.validateName = false;
      }
    });

    this.orderForm.controls.email.valueChanges.subscribe(value => {
      if(this.orderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid #ccc";
        this.validateEmail = false;
      }
    });

    this.orderForm.controls.plan.valueChanges.subscribe(value => {
      this.updateOrderTotal();
    });

    this.orderForm.controls.years.valueChanges.subscribe(value => {
      this.updateOrderTotal();
    });

    this.orderForm.controls.homeType.valueChanges.subscribe(value => {
      this.updateOrderTotal();
    });

    if(this.showForm) {
      setTimeout(()=>{

        let selectedPlan = this.route.snapshot.paramMap.get('plan');
        var plan = document.getElementById('plan') as HTMLSelectElement;
        if(selectedPlan) {
          plan.value = selectedPlan;
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

        this.updateOrderTotal();

        this.updateOptionalCoverageSelect();
      }, 100);
    }
  }

  updateOptionalCoverageSelect() {
    var optionalCoverageSelect = document.getElementById("optional-coverage") as HTMLSelectElement;
    optionalCoverageSelect.options.length = 0;
    
    var options = [];

    for(var i = 0; i < this.global.getOptionalCoverage.length; i++) {
      var option = document.createElement("option");
      option.text = this.global.getOptionalCoverage[i].option + " - " + this.global.getOptionalCoverage[i].price;
      option.value = this.global.getOptionalCoverage[i].option;
      optionalCoverageSelect.add(option);
      options.push(this.global.getOptionalCoverage[i].option + " - " + this.global.getOptionalCoverage[i].price);
    }
    
    this.multiSelect = new (MultiSelect as any)('.multi-select', {
    items: options,
    current: null,
    });
    this.multiSelect.on('change', this.multiSelectChange.bind(this));
  }

  multiSelectChange(e) {
    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
    for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        optionalCoverageSelect.options[i].selected = this.multiSelect.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
    }
    this.updateOrderTotal();
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
      this.updateOrderTotal();
    }, 100);
    
  }

  sendEmail() {
    this.validateName = true;
    this.validateEmail = true;
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

      var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
      this.orderForm.controls.promo.setValue(promoInput.value);

      this.orderForm.controls.createdDate.setValue(new Date());

      return this.database.placeOrder(this.orderForm).subscribe(response => {
        this.showForm = false;
      });
    } else {
      if(!this.orderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid crimson";
        var location = this.getElementLocation(email);
        window.scrollTo(location.left, location.top);
      }
      if(!this.orderForm.controls.name.valid) {
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

  updateOrderTotal() {
    this.total = 0;
    let plan = document.getElementById('plan') as HTMLSelectElement;
    let homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
    let isTownhome = homeTypeTH.checked;
    
    switch(plan.value) {
      case "Gold": {
        this.total += (isTownhome) ? 
        +(this.global.getPlans.gold.price - this.global.getPlans.gold.townhomeDiscount) :
        +this.global.getPlans.gold.price; 
        break;
      }
      case "Platinum": {
        this.total += (isTownhome) ? 
        +(this.global.getPlans.platinum.price - this.global.getPlans.platinum.townhomeDiscount) :
        +this.global.getPlans.platinum.price; 
        break;
      }
      case "Diamond": {
        this.total += (isTownhome) ? 
        +(this.global.getPlans.diamond.price - this.global.getPlans.diamond.townhomeDiscount) :
        +this.global.getPlans.diamond.price; 
        break;
      }
    }

    let years = this.orderForm.controls.years.value;

    if(years == "2 Years") {
      let discountYear = this.total - +(this.total * 0.10);
      this.total += +discountYear;
    }
    if(years == "3 Years") {
      let discountYear = this.total - +(this.total * 0.10);
      this.total += +(discountYear * 2);
    }

    if(this.global.getPromo.active && this.validPromo && this.orderForm.controls.promo.value != '') {
      this.total -= +this.global.getPromo.amount;
    }

    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          let option = optionalCoverageSelect.options[i].text;
          let price = option.substring(option.indexOf("$") + 1, option.lastIndexOf("/"));
          this.total += +price;
        }
      }
  }
}
