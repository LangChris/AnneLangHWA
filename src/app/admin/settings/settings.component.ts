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
    phone: new FormControl(this.global.getGeneralSettings.phoneNumber, [Validators.required]),
    owner: new FormControl(this.global.getGeneralSettings.owner, [Validators.required]),
    defaultSort: new FormControl(this.global.getGeneralSettings.defaultSortOrder, [Validators.required]),
    defaultFilename: new FormControl(this.global.getGeneralSettings.defaultFilename, [Validators.required]),
    sendEmail: new FormControl(this.global.getGeneralSettings.sendEmail, [Validators.required]),
    planOne: new FormControl(this.global.getPlans.gold.header, [Validators.required]),
    planTwo: new FormControl(this.global.getPlans.platinum.header, [Validators.required]),
    planThree: new FormControl(this.global.getPlans.diamond.header, [Validators.required]),
    promoActive: new FormControl(this.global.getPromo.active, [Validators.required]),
    promoType: new FormControl(this.global.getPromo.type, [Validators.required]),
    promoGift: new FormControl(this.global.getPromo.gift),
    promoAmount: new FormControl(this.global.getPromo.amount),
    promoCode: new FormControl(this.global.getPromo.code, [Validators.required]),
    promoEndDate: new FormControl(this.global.getPromo.endDate, [Validators.required])
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

  updateSettings() {
    if(this.settingsForm.valid) {

      if(this.settingsForm.controls.promoType.value == "Money Off") {
        this.settingsForm.controls.promoGift.setValue('');
      } else if(this.settingsForm.controls.promoType.value == "Free Gift") {
        this.settingsForm.controls.promoAmount.setValue('');
      }

      return this.database.saveGeneralSettings(this.settingsForm).subscribe(
        response => {
          this.admin.showSuccess = true;
          this.global.updateGeneralSettings();
          this.global.updatePlans();
          this.global.updatePromo();
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
