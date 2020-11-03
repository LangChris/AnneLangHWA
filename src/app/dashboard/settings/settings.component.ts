import { Component, ElementRef, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { DatabaseService } from '../../services/database.service';
import { DashboardComponent } from '../dashboard.component';
import * as MultiSelect from '../../../assets/multi-select-umd';

@Component({
  selector: 'dashboard-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  generalSettingsForm = new FormGroup({
    settingsId: new FormControl(this.global.settings.settingsId, [Validators.required]),
    webpageTitle: new FormControl(this.global.settings.webpageTitle, [Validators.required]),
    webpageSubtitle: new FormControl(this.global.settings.webpageSubtitle, [Validators.required]),
    webpageDescription: new FormControl(this.global.settings.webpageDescription, [Validators.required]),
    orderDescription: new FormControl(this.global.settings.orderDescription, [Validators.required]),
    orderMessage: new FormControl(this.global.settings.orderMessage, [Validators.required]),
    email: new FormControl(this.global.settings.email, [Validators.required]),
    alternateEmail: new FormControl(this.global.settings.alternateEmail),
    phoneNumber: new FormControl(this.global.settings.phoneNumber, [Validators.required]),
    owner: new FormControl(this.global.settings.owner, [Validators.required]),
    sendEmail: new FormControl(this.global.settings.sendEmail, [Validators.required])
  });

  userSettingsForm = new FormGroup({
    userId: new FormControl(this.global.currentUser.userId, [Validators.required]),
    type: new FormControl(this.global.currentUser.type, [Validators.required]),
    status: new FormControl(this.global.currentUser.status, [Validators.required]),
    name: new FormControl(this.global.currentUser.name, [Validators.required]),
    email: new FormControl(this.global.currentUser.email, [Validators.required]),
    alternateEmail: new FormControl(this.global.currentUser.alternateEmail),
    phoneNumber: new FormControl(this.global.currentUser.phoneNumber),
    defaultSort: new FormControl(this.global.currentUser.defaultSort, [Validators.required]),
    defaultFilename: new FormControl(this.global.currentUser.defaultFilename, [Validators.required]),
    username: new FormControl(this.global.currentUser.username),
    password: new FormControl(atob(this.global.currentUser.password), [Validators.required])
  });

  planForm = new FormGroup({
    planOne: new FormControl(this.global.plans[0].plan.name, [Validators.required]),
    planTwo: new FormControl(this.global.plans[1].plan.name, [Validators.required]),
    planThree: new FormControl(this.global.plans[2].plan.name, [Validators.required]),
    planOnePrice: new FormControl(this.global.plans[0].plan.price, [Validators.required]),
    planTwoPrice: new FormControl(this.global.plans[1].plan.price, [Validators.required]),
    planThreePrice: new FormControl(this.global.plans[2].plan.price, [Validators.required])
  });

  promoForm = new FormGroup({
    promoId: new FormControl(this.global.promo == null ? null : this.global.promo.promoId, [Validators.required]),
    active: new FormControl(this.global.promo == null ? null : this.global.promo.active, [Validators.required]),
    type: new FormControl(this.global.promo == null ? null : this.global.promo.type, [Validators.required]),
    gift: new FormControl(this.global.promo == null ? null : this.global.promo.gift),
    amount: new FormControl(this.global.promo == null ? null : this.global.promo.amount),
    coverage: new FormControl(this.global.promo == null ? null : this.global.promo.coverage),
    code: new FormControl(this.global.promo == null ? null : this.global.promo.code, [Validators.required]),
    endDate: new FormControl(this.global.promo == null ? null : this.global.promo.endDate, [Validators.required])
  });

  multiSelect: any;

  generalSettingsIsOpen = this.global.currentUser.type == 'ADMIN' ? true : false;
  userSettingsIsOpen = this.global.currentUser.type == 'ADMIN' ? false : true;
  userManagementIsOpen = false;

  userIndex = 0;

  constructor(public global: GlobalService, private database: DatabaseService, public dashboard: DashboardComponent) { }

  ngOnInit(): void {
    this.userSettingsForm.valueChanges.subscribe(response => {
      this.dashboard.showSuccess = false;
      this.dashboard.showError = false;
    });

    this.generalSettingsForm.valueChanges.subscribe(response => {
      this.dashboard.showSuccess = false;
      this.dashboard.showError = false;
    });

  }

  ngAfterContentInit() {
    if(this.global.currentUser.type == 'ADMIN') {
      setTimeout(() => {
        this.initializePromoSettings();
        this.initializePlanSettings();
      }, 500);
    }
  }

  showUser(index) {
    if(index != this.userIndex) {
      return false;
    } else {
      return true;
    }
  }

  changeUser(index) {
    this.userIndex += index;
    if(this.userIndex < 0) {
      this.userIndex = 0;
    } else if(this.userIndex > this.global.users.length - 1) {
      this.userIndex = this.global.users.length - 1;
    }
  }

  getUserOrders(id) {
    let orders = 0;
    for(let i = 0; i < this.global.orders.length; i++) {
      if(this.global.orders[i].userId == id) {
        orders++;
      }
    }
    return orders;
  }

  initializePromoSettings() {
    let active = document.getElementById('promo-active') as HTMLInputElement;
    let type = document.getElementById('promo-type') as HTMLSelectElement;
    let gift = document.getElementById('promo-gift') as HTMLInputElement;
    let amount = document.getElementById('promo-amount') as HTMLInputElement;
    let coverage = document.getElementById('promo-coverage') as HTMLSelectElement;
    let code = document.getElementById('promo-code') as HTMLInputElement;
    let codes = document.getElementById('promo-codes') as HTMLInputElement;
    let endDate = document.getElementById('promo-endDate') as HTMLInputElement;

    active.checked = this.promoForm.controls.active.value;
    type.value = this.promoForm.controls.type.value;
    gift.value = this.promoForm.controls.gift.value;
    amount.value = this.promoForm.controls.amount.value;
    coverage.value = this.promoForm.controls.coverage.value;
    code.value = this.promoForm.controls.code.value;
    codes.value = this.promoForm.controls.code.value;
    endDate.value = this.promoForm.controls.endDate.value;

    if(this.promoForm.controls.type.value == 'Free Coverage Multi') {
      var optionalCoverageSelect = document.getElementById("promo-coverages") as HTMLSelectElement;
      optionalCoverageSelect.options.length = 0;
      
      var options = [];
      let selectedOptions = [];
      for(var i = 0; i < this.global.optionalCoverages.length; i++) {
        var option = document.createElement("option");
        option.text = this.global.optionalCoverages[i].coverageOption;
        option.value = this.global.optionalCoverages[i].coverageOption;
        optionalCoverageSelect.add(option);
        options.push(option.text);
      }
      
      if(this.promoForm.controls.coverage.value != null) {
        selectedOptions = this.promoForm.controls.coverage.value.split(",");            
      }

      this.multiSelect = new (MultiSelect as any)('.multi-select', {
      items: options,
      current: selectedOptions,
      });
      this.multiSelect.on('change', this.optionalCoverageChange.bind(this));

      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        optionalCoverageSelect.options[i].selected = this.multiSelect.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
      }
    }
  }

  optionalCoverageChange(e) {
    var optionalCoverageSelect = document.getElementById('promo-coverages') as HTMLSelectElement;
    for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        optionalCoverageSelect.options[i].selected = this.multiSelect.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
    }
  }

  updatePromoForm() {
    let active = document.getElementById('promo-active') as HTMLInputElement;
    let type = document.getElementById('promo-type') as HTMLSelectElement;
    let gift = document.getElementById('promo-gift') as HTMLInputElement;
    let amount = document.getElementById('promo-amount') as HTMLInputElement;
    let coverage = document.getElementById('promo-coverage') as HTMLSelectElement;
    let code = document.getElementById('promo-code') as HTMLInputElement;
    let codes = document.getElementById('promo-codes') as HTMLInputElement;
    let endDate = document.getElementById('promo-endDate') as HTMLInputElement;

    this.promoForm.controls.active.setValue(active.checked);
    this.promoForm.controls.type.setValue(type.value);
    this.promoForm.controls.code.setValue(code.value);
    var date = new Date(endDate.value);
    date.setMinutes( date.getMinutes() + date.getTimezoneOffset() );
    this.promoForm.controls.endDate.setValue(date);

    if(this.promoForm.controls.type.value == "Money Off") {
      this.promoForm.controls.amount.setValue(amount.value);
      this.promoForm.controls.gift.setValue(null);
      this.promoForm.controls.coverage.setValue(null);
    } else if(this.promoForm.controls.type.value == "Free Gift") {
      this.promoForm.controls.gift.setValue(gift.value);
      this.promoForm.controls.amount.setValue(0);
      this.promoForm.controls.coverage.setValue(null);
    } else if(this.promoForm.controls.type.value == "Free Coverage") {
      this.promoForm.controls.coverage.setValue(coverage.value);
      this.promoForm.controls.amount.setValue(0);
      this.promoForm.controls.gift.setValue(null);
    } else if(this.promoForm.controls.type.value == "Free Coverage Multi") {
      var optionalCoverageSelect = document.getElementById('promo-coverages') as HTMLSelectElement;
      var selectedOptions = [];
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          selectedOptions.push(optionalCoverageSelect.options[i].value);
        }
      }
      this.promoForm.controls.coverage.setValue(selectedOptions.toString());
      this.promoForm.controls.amount.setValue(0);
      this.promoForm.controls.gift.setValue(null);
      this.promoForm.controls.code.setValue(codes.value);
    }
  }

  initializePlanSettings() {
    let planOne = document.getElementById('planOne') as HTMLInputElement;
    let planOnePrice = document.getElementById('planOnePrice') as HTMLInputElement;
    let planTwo = document.getElementById('planTwo') as HTMLInputElement;
    let planTwoPrice = document.getElementById('planTwoPrice') as HTMLInputElement;
    let planThree = document.getElementById('planThree') as HTMLInputElement;
    let planThreePrice = document.getElementById('planThreePrice') as HTMLInputElement;

    planOne.value = this.planForm.controls.planOne.value;
    planOnePrice.value = this.planForm.controls.planOnePrice.value;
    planTwo.value = this.planForm.controls.planTwo.value;
    planTwoPrice.value = this.planForm.controls.planTwoPrice.value;
    planThree.value = this.planForm.controls.planThree.value;
    planThreePrice.value = this.planForm.controls.planThreePrice.value;
  }

  updatePlanForm() {
    let planOne = document.getElementById('planOne') as HTMLInputElement;
    let planOnePrice = document.getElementById('planOnePrice') as HTMLInputElement;
    let planTwo = document.getElementById('planTwo') as HTMLInputElement;
    let planTwoPrice = document.getElementById('planTwoPrice') as HTMLInputElement;
    let planThree = document.getElementById('planThree') as HTMLInputElement;
    let planThreePrice = document.getElementById('planThreePrice') as HTMLInputElement;

    this.planForm.controls.planOne.setValue(planOne.value);
    this.planForm.controls.planOnePrice.setValue(planOnePrice.value);
    this.planForm.controls.planTwo.setValue(planTwo.value);
    this.planForm.controls.planTwoPrice.setValue(planTwoPrice.value);
    this.planForm.controls.planThree.setValue(planThree.value);
    this.planForm.controls.planThreePrice.setValue(planThreePrice.value);
  }

  showPromoType(type: string) {
    let promoType = document.getElementById('promo-type') as HTMLSelectElement;
    return promoType.value == type ? true : false;
    return false;
  }

  newSpecialRequest() {
    let specialRequestsSection = document.getElementById('special-requests') as HTMLTableSectionElement;
    let specialRequestsRows = document.getElementById('special-requests').getElementsByTagName("tr") as HTMLCollection;
    let lastRow = specialRequestsRows[specialRequestsRows.length - 1] as HTMLTableRowElement;
    let lastRowInput = lastRow.children[1].children[0] as HTMLInputElement;
    if(lastRowInput.value != "") {
      let newRow = lastRow.cloneNode(true) as HTMLTableRowElement;
      let rowInput = newRow.children[1].children[0] as HTMLInputElement;
      rowInput.value = "";
      specialRequestsSection.appendChild(newRow);
    }
  }

  newOptionalCoverage() {
    let optionalCoverageSection = document.getElementById('optional-coverages') as HTMLTableSectionElement;
    let optionalCoverageRows = document.getElementById('optional-coverages').getElementsByTagName("tr") as HTMLCollection;
    let lastRow = optionalCoverageRows[optionalCoverageRows.length - 1] as HTMLTableRowElement;
    let lastRowInput = lastRow.children[1].children[0] as HTMLInputElement;
    if(lastRowInput.value != "") {
      let newRow = lastRow.cloneNode(true) as HTMLTableRowElement;
      let rowOption = newRow.children[1].children[0] as HTMLInputElement;
      let rowPrice = newRow.children[1].children[1] as HTMLInputElement;
      rowOption.value = "";
      rowPrice.value = "";
      optionalCoverageSection.appendChild(newRow);
    }
  }

  updateSettings() {
    if(this.global.currentUser.type == 'ADMIN') {
      this.updateGeneralSettings();
      this.updatePromoSettings();
      this.updatePlanSettings();
      this.updateOptionalCoverageSettings();
      this.updateSpecialRequestSettings();
    } 
    
    this.updateUserSettings();
  }

  updateGeneralSettings() {
    if(this.generalSettingsForm.valid) {

      return this.database.HwaUpdateSettings(this.generalSettingsForm, this.global.currentUser.token).subscribe(
        response => {
        },
        error => {
          this.dashboard.showError = true;
        }
      );

    } else {
      console.log(this.generalSettingsForm);
      this.dashboard.showError = true;
    }
  }

  updatePromoSettings() {
    this.updatePromoForm();

    if(this.promoForm.valid) {
      return this.database.HwaUpdatePromo(this.promoForm, this.global.currentUser.token).subscribe(
        response => {
        },
        error => {
          this.dashboard.showError = true;
        }
      );

    } else {
      console.log(this.promoForm);
      this.dashboard.showError = true;
    }

  }

  updatePlanSettings() {
    this.updatePlanForm();

    if(this.planForm.valid) {
      let plans = [];
      for(let i = 0; i < this.global.plans.length; i++) {
        let name = "";
        let price = 0;
        if(i == 0) {
          name = this.planForm.controls.planOne.value;
          price = this.planForm.controls.planOnePrice.value;
        } else if(i == 1) {
          name = this.planForm.controls.planTwo.value;
          price = this.planForm.controls.planTwoPrice.value;
        } else {
          name = this.planForm.controls.planThree.value;
          price = this.planForm.controls.planThreePrice.value;
        }
        
        let plan = {
          name: name,
          price: +price,
          townhomeDiscount: this.global.plans[i].plan.townhomeDiscount
        };
        plans.push(plan);
      }
      return this.database.HwaUpdatePlans(plans, this.global.currentUser.token).subscribe(
        response => {
        },
        error => {
          this.dashboard.showError = true;
        }
      );
    } else {
      console.log(this.planForm);
      this.dashboard.showError = true;
    }
  }

  updateOptionalCoverageSettings() {
    let optionalCoverages = [];
      let coverages = document.getElementsByClassName('optionalCoverages');
      let prices = document.getElementsByClassName('optionalCoveragePrices');
      for(var i = 0; i < coverages.length; i++) {
        let coverage = coverages[i] as HTMLInputElement;
        let price = prices[i] as HTMLInputElement;
        let option = {
          coverageOption: coverage.value, 
          price: price.value
        };
        if(option.coverageOption != "" && option.price != "") {
          optionalCoverages.push(option);
        }
      }
      return this.database.HwaUpdateOptionalCoverages(optionalCoverages, this.global.currentUser.token).subscribe(
        response => {
        },
        error => {
          this.dashboard.showError = true;
        }
      );
  }

  updateSpecialRequestSettings() {
    let specialRequests = [];
      let requests = document.getElementsByClassName('specialRequests');
      for(var i = 0; i < requests.length; i++) {
        let request = requests[i] as HTMLInputElement;
        if(request.value != "") {
          specialRequests.push(
            {
              request: request.value
            }
          );
        }
      }
      return this.database.HwaUpdateSpecialRequests(specialRequests, this.global.currentUser.token).subscribe(
        response => {
        },
        error => {
          this.dashboard.showError = true;
        }
      );
  }

  updateUserSettings() {
      if(this.userSettingsForm.valid) {
        this.userSettingsForm.controls.password.setValue(btoa(this.userSettingsForm.controls.password.value));
        
        return this.database.HwaUpdateUser(this.userSettingsForm).subscribe(
          response => {
            this.dashboard.showSuccess = true;
            this.global.hwaLogin(this.userSettingsForm.controls.username.value, atob(this.userSettingsForm.controls.password.value));
            this.global.hwaGetSettings();
            this.global.hwaGetPlans();
            this.global.hwaGetPromo();
            this.global.hwaGetOrders();
            setTimeout(()=>{
              this.dashboard.updateDisplay('DASHBOARD');
            },1000);
          },
          error => {
            this.dashboard.showError = true;
          }
        );

      } else {
        console.log(this.userSettingsForm);
        this.dashboard.showError = true;
      }
  }

  togglePassword() {
    var pass = document.getElementById("password") as HTMLInputElement;
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }

}
