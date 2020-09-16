import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { DatabaseService } from '../../services/database.service';
import { DashboardComponent } from '../dashboard.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'dashboard-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  generalSettingsForm = new FormGroup({
    title: new FormControl(this.global.settings.webpageTitle, [Validators.required]),
    subtitle: new FormControl(this.global.settings.webpageSubTitle, [Validators.required]),
    description: new FormControl(this.global.settings.webpageDescription, [Validators.required]),
    orderDescription: new FormControl(this.global.settings.orderDescription, [Validators.required]),
    orderMessage: new FormControl(this.global.settings.orderMessage, [Validators.required]),
    email: new FormControl(this.global.settings.email, [Validators.required]),
    passwordResetEmail: new FormControl(this.global.settings.alternateEmail, [Validators.required]),
    phone: new FormControl(this.global.settings.phoneNumber, [Validators.required]),
    owner: new FormControl(this.global.settings.owner, [Validators.required]),
    defaultSort: new FormControl('DESC', [Validators.required]),
    defaultFilename: new FormControl('Orders', [Validators.required]),
    sendEmail: new FormControl(this.global.settings.sendEmail, [Validators.required]),
    planOne: new FormControl(this.global.plans[0].plan.name, [Validators.required]),
    planTwo: new FormControl(this.global.plans[1].plan.name, [Validators.required]),
    planThree: new FormControl(this.global.plans[2].plan.name, [Validators.required]),
    planOnePrice: new FormControl(this.global.plans[0].plan.price, [Validators.required]),
    planTwoPrice: new FormControl(this.global.plans[1].plan.price, [Validators.required]),
    planThreePrice: new FormControl(this.global.plans[2].plan.price, [Validators.required]),
    promoActive: new FormControl(this.global.promo.active, [Validators.required]),
    promoType: new FormControl(this.global.promo.type, [Validators.required]),
    promoGift: new FormControl(this.global.promo.gift),
    promoAmount: new FormControl(this.global.promo.amount),
    promoCoverage: new FormControl(this.global.promo.coverage),
    promoCode: new FormControl(this.global.promo.code, [Validators.required]),
    promoEndDate: new FormControl(this.global.promo.endDate, [Validators.required]),
    specialRequest: new FormControl(),
    optionalCoverage: new FormControl(),
    id: new FormControl(this.global.currentUser.id, [Validators.required]),
    usersType: new FormControl(this.global.currentUser.type, [Validators.required]),
    usersName: new FormControl(this.global.currentUser.name, [Validators.required]),
    emailAddress: new FormControl(this.global.currentUser.email, [Validators.required]),
    alternateEmail: new FormControl(this.global.currentUser.alternate_email),
    phoneNumber: new FormControl(this.global.currentUser.phone_number),
    loginUsername: new FormControl(this.global.currentUser.username),
    loginPassword: new FormControl(atob(this.global.currentUser.password), [Validators.required])
  });


  userSettingsForm = new FormGroup({
    id: new FormControl(this.global.currentUser.id, [Validators.required]),
    usersType: new FormControl(this.global.currentUser.type, [Validators.required]),
    usersName: new FormControl(this.global.currentUser.name, [Validators.required]),
    emailAddress: new FormControl(this.global.currentUser.email, [Validators.required]),
    alternateEmail: new FormControl(this.global.currentUser.alternateEmail),
    phoneNumber: new FormControl(this.global.currentUser.phoneNumber),
    loginUsername: new FormControl(this.global.currentUser.username),
    loginPassword: new FormControl(atob(this.global.currentUser.password), [Validators.required])
  });



  constructor(public global: GlobalService, private database: DatabaseService, public dashboard: DashboardComponent, public login: LoginService) { }

  ngOnInit(): void {
    console.log('DASHBOARD SETTINGS LOADED');
    this.generalSettingsForm.valueChanges.subscribe(response => {
      this.dashboard.showSuccess = false;
      this.dashboard.showError = false;
    });

    if(this.global.currentUser.type == 'ADMIN') {
      setTimeout(() => {
        if(this.generalSettingsForm.controls.promoType.value == 'Free Coverage Multi') {
          let coverage1 = document.getElementById('promoCoverageMulti1') as HTMLSelectElement;
          let coverage2 = document.getElementById('promoCoverageMulti2') as HTMLSelectElement;
          let code1 = document.getElementById('promoCodeMulti1') as HTMLInputElement;
          let code2 = document.getElementById('promoCodeMulti2') as HTMLInputElement;
    
          coverage1.value = this.global.promo.coverage.substring(0, this.global.promo.coverage.indexOf(','));
          coverage2.value = this.global.promo.coverage.substring(this.global.promo.coverage.indexOf(',') + 1);
    
          code1.value = this.global.promo.code.substring(0, this.global.promo.code.indexOf(','));
          code2.value = this.global.promo.code.substring(this.global.promo.code.indexOf(',') + 1);
        }
      }, 1000);
    }
  }

  showPromoType(type: string) {
    let promoType = document.getElementById('promo-type') as HTMLSelectElement;
    return promoType.value == type ? true : false;
  }

  promoDisabled() {
    return this.generalSettingsForm.controls.promoActive.value ? false : true;
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
      if(this.generalSettingsForm.valid) {
        if(this.generalSettingsForm.controls.promoType.value == "Money Off") {
          this.generalSettingsForm.controls.promoGift.setValue('');
          this.generalSettingsForm.controls.promoCoverage.setValue('Select One');
        } else if(this.generalSettingsForm.controls.promoType.value == "Free Gift") {
          this.generalSettingsForm.controls.promoAmount.setValue('');
          this.generalSettingsForm.controls.promoCoverage.setValue('Select One');
        } else if(this.generalSettingsForm.controls.promoType.value == "Free Coverage") {
          this.generalSettingsForm.controls.promoAmount.setValue('');
          this.generalSettingsForm.controls.promoGift.setValue('');
        } else if(this.generalSettingsForm.controls.promoType.value == "Free Coverage Multi") {
          this.generalSettingsForm.controls.promoAmount.setValue('');
          this.generalSettingsForm.controls.promoGift.setValue('');
        }

        let specialRequests = [];
        let requests = document.getElementsByClassName('specialRequests');
        for(var i = 0; i < requests.length; i++) {
          let request = requests[i] as HTMLInputElement;
          if(request.value != "") {
            specialRequests.push(request.value);
          }
        }

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
    
        this.generalSettingsForm.controls.specialRequest.setValue(specialRequests);
        this.generalSettingsForm.controls.optionalCoverage.setValue(optionalCoverages);

        this.userSettingsForm.controls.loginPassword.setValue(btoa(this.userSettingsForm.controls.loginPassword.value));

        if(!this.global.testing) {
          return this.database.saveSettings(this.generalSettingsForm).subscribe(
            response => {
              this.dashboard.showSuccess = true;
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
          console.log(this.generalSettingsForm.value);
          this.dashboard.showSuccess = true;
          setTimeout(()=>{
            this.dashboard.updateDisplay('DASHBOARD');
          },1000);
        }
      } else {
        this.dashboard.showError = true;
      }

    } else {

      this.userSettingsForm.controls.id.setValue(this.generalSettingsForm.controls.id.value);
      this.userSettingsForm.controls.usersType.setValue(this.generalSettingsForm.controls.usersType.value);
      this.userSettingsForm.controls.usersName.setValue(this.generalSettingsForm.controls.usersName.value);
      this.userSettingsForm.controls.emailAddress.setValue(this.generalSettingsForm.controls.emailAddress.value);
      this.userSettingsForm.controls.alternateEmail.setValue(this.generalSettingsForm.controls.alternateEmail.value);
      this.userSettingsForm.controls.phoneNumber.setValue(this.generalSettingsForm.controls.phoneNumber.value);
      this.userSettingsForm.controls.loginUsername.setValue(this.generalSettingsForm.controls.loginUsername.value);
      this.userSettingsForm.controls.loginPassword.setValue(this.generalSettingsForm.controls.loginPassword.value);

      if(this.userSettingsForm.valid) {
        this.generalSettingsForm.controls.loginPassword.setValue(btoa(this.userSettingsForm.controls.loginPassword.value));

        if(!this.global.testing) {
          return this.database.saveSettings(this.generalSettingsForm).subscribe(
            response => {
              this.dashboard.showSuccess = true;
              this.global.hwaLogin(this.userSettingsForm.controls.loginUsername.value, this.userSettingsForm.controls.loginPassword.value);
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
          console.log(this.generalSettingsForm.value);
          this.dashboard.showSuccess = true;
          setTimeout(()=>{
            this.dashboard.updateDisplay('DASHBOARD');
          },1000);
        }
      } else {
        this.dashboard.showError = true;
      }
    }
  }

  togglePassword() {
    var pass = document.getElementById("login-password") as HTMLInputElement;
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }

}
