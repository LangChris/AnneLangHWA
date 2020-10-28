import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { DatabaseService } from '../../services/database.service';
import { DashboardComponent } from '../dashboard.component';

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

    this.initializeUserSettings();

    if(this.global.currentUser.type == 'ADMIN') {
      setTimeout(() => {
        this.initializePromoSettings();
        this.initializePlanSettings();
      }, 500);
    }
  }

  initializeUserSettings() {
    let name = document.getElementById('users-name') as HTMLInputElement;
    let email = document.getElementById('email-address') as HTMLInputElement;
    let alternateEmail = document.getElementById('alternate-email') as HTMLInputElement;
    let phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
    let defaultSort = document.getElementById('default-sort') as HTMLSelectElement;
    let defaultFilename = document.getElementById('default-filename') as HTMLInputElement;
    let username = document.getElementById('username') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;

    name.value = this.userSettingsForm.controls.name.value;
    email.value = this.userSettingsForm.controls.email.value;
    alternateEmail.value = this.userSettingsForm.controls.alternateEmail.value;
    phoneNumber.value = this.userSettingsForm.controls.phoneNumber.value;
    defaultSort.value = this.userSettingsForm.controls.defaultSort.value;
    defaultFilename.value = this.userSettingsForm.controls.defaultFilename.value;
    username.value = this.userSettingsForm.controls.username.value;
    password.value = this.userSettingsForm.controls.password.value;
  }

  updateUserSettingsForm() {
    let name = document.getElementById('users-name') as HTMLInputElement;
    let email = document.getElementById('email-address') as HTMLInputElement;
    let alternateEmail = document.getElementById('alternate-email') as HTMLInputElement;
    let phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
    let defaultSort = document.getElementById('default-sort') as HTMLInputElement;
    let defaultFilename = document.getElementById('default-filename') as HTMLInputElement;
    let username = document.getElementById('username') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;

    this.userSettingsForm.controls.name.setValue(name.value);
    this.userSettingsForm.controls.email.setValue(email.value);
    this.userSettingsForm.controls.alternateEmail.setValue(alternateEmail.value);
    this.userSettingsForm.controls.phoneNumber.setValue(phoneNumber.value);
    this.userSettingsForm.controls.defaultSort.setValue(defaultSort.value);
    this.userSettingsForm.controls.defaultFilename.setValue(defaultFilename.value);
    this.userSettingsForm.controls.username.setValue(username.value);
    this.userSettingsForm.controls.password.setValue(password.value);
  }

  initializePromoSettings() {
    let active = document.getElementById('promo-active') as HTMLInputElement;
    let type = document.getElementById('promo-type') as HTMLSelectElement;
    let gift = document.getElementById('promo-gift') as HTMLInputElement;
    let amount = document.getElementById('promo-amount') as HTMLInputElement;
    let coverage = document.getElementById('promo-coverage') as HTMLSelectElement;
    let code = document.getElementById('promo-code') as HTMLInputElement;
    let endDate = document.getElementById('promo-endDate') as HTMLInputElement;

    active.checked = this.promoForm.controls.active.value;
    type.value = this.promoForm.controls.type.value;
    gift.value = this.promoForm.controls.gift.value;
    amount.value = this.promoForm.controls.amount.value;
    coverage.value = this.promoForm.controls.coverage.value;
    code.value = this.promoForm.controls.code.value;
    endDate.value = this.promoForm.controls.endDate.value;

    if(this.promoForm.controls.type.value == 'Free Coverage Multi') {
      let coverage1 = document.getElementById('promoCoverageMulti1') as HTMLSelectElement;
      let coverage2 = document.getElementById('promoCoverageMulti2') as HTMLSelectElement;
      let code1 = document.getElementById('promoCodeMulti1') as HTMLInputElement;
      let code2 = document.getElementById('promoCodeMulti2') as HTMLInputElement;

      coverage1.value = this.promoForm.controls.coverage.value.substring(0, this.promoForm.controls.coverage.value.indexOf(','));
      coverage2.value = this.promoForm.controls.coverage.value.substring(this.promoForm.controls.coverage.value.indexOf(',') + 1);

      code1.value = code.value.substring(0, code.value.indexOf(','));
      code2.value = code.value.substring(code.value.indexOf(',') + 1);
    }
  }

  updatePromoForm() {
    let active = document.getElementById('promo-active') as HTMLInputElement;
    let type = document.getElementById('promo-type') as HTMLSelectElement;
    let gift = document.getElementById('promo-gift') as HTMLInputElement;
    let amount = document.getElementById('promo-amount') as HTMLInputElement;
    let coverage = document.getElementById('promo-coverage') as HTMLSelectElement;
    let code = document.getElementById('promo-code') as HTMLInputElement;
    let endDate = document.getElementById('promo-endDate') as HTMLInputElement;

    let coverage1 = document.getElementById('promoCoverageMulti1') as HTMLSelectElement;
    let coverage2 = document.getElementById('promoCoverageMulti2') as HTMLSelectElement;

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
      this.promoForm.controls.coverage.setValue(coverage1.value + "," + coverage2.value);
      this.promoForm.controls.amount.setValue(0);
      this.promoForm.controls.gift.setValue(null);
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
      //this.updatePlanSettings();
      //this.updateOptionalCoverageSettings();
      //this.updateSpecialRequestSettings();
    } 
    
    this.updateUserSettings();
  }

  updateGeneralSettings() {
    if(this.generalSettingsForm.valid) {

      return this.database.HwaUpdateSettings(this.generalSettingsForm).subscribe(
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
      return this.database.HwaUpdatePromo(this.promoForm).subscribe(
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
      //Update Plans
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
          option: coverage.value, 
          price: price.value
        };
        if(option.option != "" && option.price != "") {
          optionalCoverages.push(option);
        }
      }
  }

  updateSpecialRequestSettings() {
    let specialRequests = [];
      let requests = document.getElementsByClassName('specialRequests');
      for(var i = 0; i < requests.length; i++) {
        let request = requests[i] as HTMLInputElement;
        if(request.value != "") {
          specialRequests.push(request.value);
        }
      }
  }

  updateUserSettings() {
      this.updateUserSettingsForm();

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
