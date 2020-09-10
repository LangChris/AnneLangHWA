import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import * as MultiSelect from '../../assets/multi-select-umd';
import { LoginService } from '../services/login.service';

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
    closeStartDate: new FormControl('', [Validators.required]),
    optionalCoverage: new FormControl([]),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    realtorCompany: new FormControl(),
    realtorZip: new FormControl(),
    titleAgentEmail: new FormControl(),
    promo: new FormControl(),
    specialRequest: new FormControl(),
    createdDate: new FormControl(),
    sendEmail: new FormControl(),
    adminName: new FormControl(),
    adminEmail: new FormControl(),
    orderTotal: new FormControl(),
    userId: new FormControl()
  }); 

  showForm = true;
  validPromo = false;

  validateName = false;
  validateEmail = false;

  validateDate = false;

  total: number = 0;

  optionalCoverageMultiSelect: any;

  progressStep = 1;

  helpClicked = false;

  panel = "LOGIN";

  active = "LOGIN";

  constructor(public global: GlobalService, private route: ActivatedRoute, private database: DatabaseService, private formBuilder: FormBuilder, private login: LoginService) {}

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

        if(this.global.displayPromo()) {
          var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
          if(this.global.getPromo.type == 'Free Coverage Multi') {
            let code1 = this.global.getPromo.code.substring(0, this.global.getPromo.code.indexOf(','));
            promoInput.value = code1;
          } else {
            promoInput.value = this.global.getPromo.code;
          }
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
    
    this.optionalCoverageMultiSelect = new (MultiSelect as any)('.multi-select', {
    items: options,
    current: null,
    });
    this.optionalCoverageMultiSelect.on('change', this.optionalCoverageChange.bind(this));
  }

  optionalCoverageChange(e) {
    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
    for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        optionalCoverageSelect.options[i].selected = this.optionalCoverageMultiSelect.getCurrent('value').indexOf(optionalCoverageSelect.options[i].text) >= 0;
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
        console.log('promoInputValue: ' + promoInputValue);
        console.log(this.global.getPromo);
          if(this.global.displayPromo()) {
              if(this.global.getPromo.type = 'Free Coverage Multi' ) {
                let code1 = this.global.getPromo.code.substring(0, this.global.getPromo.code.indexOf(','));
                let code2 = this.global.getPromo.code.substring(this.global.getPromo.code.indexOf(',') + 1);
                console.log(code1);
                console.log(code2);
                if(promoInputValue === code1 || promoInputValue === code2) {
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
              } else if(this.global.getPromo.code === promoInputValue) {
                promoInput.style.border = "1px solid green";
                promoStatus.style.color = "green";
                promoStatus.innerHTML = " &#10004; Valid";
                this.validPromo = true;
              }
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

      if(this.validPromo && this.global.getPromo.active && this.global.getPromo.type == 'Free Coverage') {
        for(var i = 0; i < this.optionalCoverageMultiSelect.options.items.size; i++) {
          let value = this.optionalCoverageMultiSelect.options.items.get(i).value;
          if(value.toString().includes(this.global.getPromo.coverage)) {
            this.optionalCoverageMultiSelect.options.items.get(i).selected = true;
            this.optionalCoverageChange(null);

            let result = document.getElementById('multi-select').getElementsByClassName('si-result')[0];
            let list = document.getElementById('multi-select').getElementsByClassName('si-list')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');

            result.innerHTML = value;

            for(var i  = 0; i < list.length; i++) {
              if(value.indexOf(list[i].innerHTML) >= 0) {
                if(!list[i].classList.contains('si-selected')) {
                  list[i].classList.add('si-selected');
                }
              }
            }
          }
        }
      } else if(this.validPromo && this.global.getPromo.active && this.global.getPromo.type == 'Free Coverage Multi') {
        for(var i = 0; i < this.optionalCoverageMultiSelect.options.items.size; i++) {
          let value = this.optionalCoverageMultiSelect.options.items.get(i).value;

          let coverage1 = this.global.getPromo.coverage.substring(0, this.global.getPromo.coverage.indexOf(','));

          if(value.toString().includes(coverage1)) {
            this.optionalCoverageMultiSelect.options.items.get(i).selected = true;
            this.optionalCoverageChange(null);

            let result = document.getElementById('multi-select').getElementsByClassName('si-result')[0];
            let list = document.getElementById('multi-select').getElementsByClassName('si-list')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');

            result.innerHTML = value;

            for(var i  = 0; i < list.length; i++) {
              if(value.indexOf(list[i].innerHTML) >= 0) {
                if(!list[i].classList.contains('si-selected')) {
                  list[i].classList.add('si-selected');
                }
              }
            }
          }
        }
      }

      this.updateOrderTotal();
    }, 100);
    
  }

  submitOrder() {
    if(this.orderForm.valid) {
      var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
      var selectedOptions = [];
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          selectedOptions.push(optionalCoverageSelect.options[i].value);
        }
      }
      this.orderForm.controls.optionalCoverage.setValue(selectedOptions);

      let selectedSpecialRequests = [];
      for(let i = 0; i < this.global.getSpecialRequest.length; i++) {
        var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
        if(specialRequest.checked) {
          selectedSpecialRequests.push(this.global.getSpecialRequest[i]);
        }
      }
      
      this.orderForm.controls.specialRequest.setValue(selectedSpecialRequests);
      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.orderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.orderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
      this.orderForm.controls.promo.setValue(promoInput.value);

      let today = new Date;
      this.orderForm.controls.createdDate.setValue(today);
      this.orderForm.controls.sendEmail.setValue(this.global.getGeneralSettings.sendEmail);
      this.orderForm.controls.adminName.setValue(this.global.getGeneralSettings.owner);
      this.orderForm.controls.adminEmail.setValue(this.global.getGeneralSettings.email);
      this.orderForm.controls.orderTotal.setValue("$" + this.total);

      this.orderForm.controls.userId.setValue(this.login.currentUser != null ? this.login.currentUser.id : null);
      
      if(!this.global.testing) {
        return this.database.placeOrder(this.orderForm).subscribe(response => {
          this.showForm = false;
        });
      } else {
        this.showForm = false;
      }
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

  makeProgressStep(direction) {
    switch(direction) {
      case "PREV": this.progressStep--; break;
      case "NEXT": { 
        if(this.progressStep == 1) {

          // if logged in -> proceed next
          if(this.login.currentUser != null) {
            this.toggleActive('LOGIN');
            this.progressStep++; 
            break;
          }

          // validate login
          if(this.active == "LOGIN") {
            let username = document.getElementById('login-username') as HTMLInputElement;
            let password = document.getElementById('login-password') as HTMLInputElement;

            if(this.loginSuccessful(username.value, password.value)) {
              // update name and email with info
              this.orderForm.controls.name.setValue(this.login.currentUser.name);
              this.orderForm.controls.email.setValue(this.login.currentUser.email);
            } 
          } else {
            this.validateName = true;
            this.validateEmail = true;
          }
        } else if(this.progressStep == 3) {
          this.validateDate = true;
        }

        if( (this.progressStep != 1 && this.progressStep != 3) || 
        //guest checkout and email/name valid
        (this.progressStep == 1 && this.active == 'GUEST' && this.orderForm.controls.email.valid && this.orderForm.controls.name.valid) ||
        //login and status = successful
        (this.progressStep == 1 && this.active == 'LOGIN' && this.login.getStatus.successful) ||
        this.orderForm.valid) {
          this.progressStep++; 
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

          if(this.progressStep == 3 && !this.orderForm.controls.closeStartDate.valid) {
            var closeStartDate = document.getElementById('closeStartDate') as HTMLInputElement;
            name.style.border = "1px solid crimson";
            var location = this.getElementLocation(closeStartDate);
            window.scrollTo(location.left, location.top);
          }
        }
      } break;
    }
  }

  toggleHelpClicked() {
    this.helpClicked = this.helpClicked ? false : true;
  }

  updateOrderTotal() {
    this.total = 0;
    let plan = document.getElementById('plan') as HTMLSelectElement;
    let homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
    let isTownhome = homeTypeTH.checked;
    var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
    this.orderForm.controls.promo.setValue(promoInput.value);
    
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

    if(this.global.getPromo.active && this.validPromo && this.orderForm.controls.promo.value != '' && this.global.getPromo.type == 'Money Off') {
      this.total -= +this.global.getPromo.amount;
    }

    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          let option = optionalCoverageSelect.options[i].text;
          let price = option.substring(option.indexOf("$") + 1, option.lastIndexOf("/"));
          if(!this.validPromo) {
            this.total += +price;
          } else {
            if(this.global.getPromo.type == 'Free Coverage' && this.orderForm.controls.promo.value != '') {
              if(!option.includes(this.global.getPromo.coverage)) {
                this.total += +price;
              }
            } else if(this.global.getPromo.type == 'Free Coverage Multi' && this.orderForm.controls.promo.value != '') {
              let coverage1 = this.global.getPromo.coverage.substring(0, this.global.getPromo.coverage.indexOf(','));
              let coverage2 = this.global.getPromo.coverage.substring(this.global.getPromo.coverage.indexOf(',') + 1);
              let code1 = this.global.getPromo.code.substring(0, this.global.getPromo.code.indexOf(','));
              let code2 = this.global.getPromo.code.substring(this.global.getPromo.code.indexOf(',') + 1);

              if( (!option.includes(coverage1) && !option.includes(coverage2))  ||
                  (option.includes(coverage1) && this.orderForm.controls.promo.value != code1) ||
                  (option.includes(coverage2) && this.orderForm.controls.promo.value != code2)) {
                this.total += +price;
              } 
            } else {
              this.total += +price;
            }
          }
        }
      }
  }

  togglePanel(panel) {
    let loginText = document.getElementById('login-text');
    let registerText = document.getElementById('register-text');

    this.panel = panel; 

    switch(panel) {
      case "LOGIN": {
        registerText.style.opacity = '0.5'; 
        registerText.style.fontSize = '10px'; 
        loginText.style.opacity = '1.0';
        loginText.style.fontSize = '20px'; 
      } break;
      case "REGISTER": {
        loginText.style.opacity = '0.5'; 
        loginText.style.fontSize = '10px'; 
        registerText.style.opacity = '1.0';
        registerText.style.fontSize = '20px'; 
      } break;
    }
  }

  toggleActive(active) {

    let loginRegisterBox = document.getElementById('login-register-box');
    let guestCheckoutBox = document.getElementById('guest-checkout-box');

    this.active = active;

    switch(active) {
      case "GUEST": {
        loginRegisterBox.style.opacity = '0.25'; 
        guestCheckoutBox.style.opacity = '1.0'; 
        guestCheckoutBox.style.background = "#eee"
      } break;
      case "LOGIN": {
        guestCheckoutBox.style.opacity = '0.25'; 
        loginRegisterBox.style.opacity = '1.0'; 
        loginRegisterBox.style.background = "#eee"
      } break;
    }
  }

  isLoginActive() {
    // if logged in -> proceed next
    if(this.login.currentUser != null && this.progressStep == 1) {
      this.toggleActive('LOGIN');
      this.makeProgressStep("NEXT");
    }

    let loginUsername = document.getElementById('login-username') as HTMLInputElement;
    let loginPassword = document.getElementById('login-password') as HTMLInputElement;

    if( ((loginUsername.value != null && loginUsername.value != '') || 
    (loginPassword.value != null && loginPassword.value != '')) ) {
      this.toggleActive('LOGIN');
      return true;
    } 

    this.toggleActive('GUEST');
    return false;
  }

  loginSuccessful(user: string, pass: string) {
      this.login.loginWithoutRedirect(user, pass);
      if(this.login.getStatus.successful) {
        return true;
      }
    
    return false;
  }
}
