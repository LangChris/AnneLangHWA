import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AdminComponent } from '../admin.component';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingsForm = new FormGroup({
    title: new FormControl(this.global.getGeneralSettings.webpageTitle, [Validators.required]),
    subtitle: new FormControl(this.global.getGeneralSettings.webpageSubTitle, [Validators.required]),
    description: new FormControl(this.global.getGeneralSettings.webpageDescription, [Validators.required]),
    orderDescription: new FormControl(this.global.getGeneralSettings.orderDescription, [Validators.required]),
    orderMessage: new FormControl(this.global.getGeneralSettings.orderMessage, [Validators.required]),
    email: new FormControl(this.global.getGeneralSettings.email, [Validators.required]),
    passwordResetEmail: new FormControl(this.global.getGeneralSettings.passwordResetEmail, [Validators.required]),
    phone: new FormControl(this.global.getGeneralSettings.phoneNumber, [Validators.required]),
    owner: new FormControl(this.global.getGeneralSettings.owner, [Validators.required]),
    defaultSort: new FormControl(this.global.getGeneralSettings.defaultSortOrder, [Validators.required]),
    defaultFilename: new FormControl(this.global.getGeneralSettings.defaultFilename, [Validators.required]),
    sendEmail: new FormControl(this.global.getGeneralSettings.sendEmail, [Validators.required]),
    planOne: new FormControl(this.global.getPlans.gold.header, [Validators.required]),
    planTwo: new FormControl(this.global.getPlans.platinum.header, [Validators.required]),
    planThree: new FormControl(this.global.getPlans.diamond.header, [Validators.required]),
    planOnePrice: new FormControl(this.global.getPlans.gold.price, [Validators.required]),
    planTwoPrice: new FormControl(this.global.getPlans.platinum.price, [Validators.required]),
    planThreePrice: new FormControl(this.global.getPlans.diamond.price, [Validators.required]),
    promoActive: new FormControl(this.global.getPromo.active, [Validators.required]),
    promoType: new FormControl(this.global.getPromo.type, [Validators.required]),
    promoGift: new FormControl(this.global.getPromo.gift),
    promoAmount: new FormControl(this.global.getPromo.amount),
    promoCoverage: new FormControl(this.global.getPromo.coverage),
    promoCode: new FormControl(this.global.getPromo.code, [Validators.required]),
    promoEndDate: new FormControl(this.global.getPromo.endDate, [Validators.required]),
    loginUsername: new FormControl(this.global.getLogin.username),
    loginPassword: new FormControl(this.global.getLogin.password),
    specialRequest: new FormControl(),
    optionalCoverage: new FormControl()
  });

  constructor(public global: GlobalService, public admin: AdminComponent, private database: DatabaseService) { }

  ngOnInit(): void {
    this.settingsForm.valueChanges.subscribe(response => {
      this.admin.showSuccess = false;
      this.admin.showError = false;
    });
  }

  showPromoType(type: string) {
    let promoType = document.getElementById('promo-type') as HTMLSelectElement;
    return promoType.value == type ? true : false;
  }

  promoDisabled() {
    return this.settingsForm.controls.promoActive.value ? false : true;
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
    if(this.settingsForm.valid) {

      if(this.settingsForm.controls.promoType.value == "Money Off") {
        this.settingsForm.controls.promoGift.setValue('');
        this.settingsForm.controls.promoCoverage.setValue('Select One');
      } else if(this.settingsForm.controls.promoType.value == "Free Gift") {
        this.settingsForm.controls.promoAmount.setValue('');
        this.settingsForm.controls.promoCoverage.setValue('Select One');
      } else if(this.settingsForm.controls.promoType.value == "Free Coverage") {
        this.settingsForm.controls.promoAmount.setValue('');
        this.settingsForm.controls.promoGift.setValue('');
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
  
      this.settingsForm.controls.loginPassword.setValue(btoa(this.settingsForm.controls.loginPassword.value));
      this.settingsForm.controls.specialRequest.setValue(specialRequests);
      this.settingsForm.controls.optionalCoverage.setValue(optionalCoverages);

      return this.database.saveGeneralSettings(this.settingsForm).subscribe(
        response => {
          this.admin.showSuccess = true;
          this.global.updateGeneralSettings();
          this.global.updatePlans();
          this.global.updatePromo();
          this.global.updateLogin();
          setTimeout(()=>{
            this.admin.updateDisplay('DASHBOARD');
          },1000);
        },
        error => {
          this.admin.showError = true;
        }
      );
    } else {
      this.admin.showError = true;
    }
  }

}
