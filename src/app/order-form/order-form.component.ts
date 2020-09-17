import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import * as MultiSelect from '../../assets/multi-select-umd';
import { RegisterService } from '../services/register.service';

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

  registerLogin = {
    username: "",
    password: ""
  };

  constructor(public global: GlobalService, private route: ActivatedRoute, private database: DatabaseService, private formBuilder: FormBuilder, private register: RegisterService) {}

  ngOnInit() {
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
          plan.value = selectedPlan.toUpperCase();
        } else {
          plan.selectedIndex = 0;
        }
        

        var homeType = document.getElementById('home-type-sf') as HTMLInputElement;
        homeType.checked = true;

        if(this.global.promo != null) {
          var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
          if(this.global.promo.type == 'Free Coverage Multi') {
            let code1 = this.global.promo.code.substring(0, this.global.promo.code.indexOf(','));
            promoInput.value = code1;
          } else {
            promoInput.value = this.global.promo.code;
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

    for(var i = 0; i < this.global.optionalCoverages.length; i++) {
      var option = document.createElement("option");
      option.text = this.global.optionalCoverages[i].coverageOption + " - " + this.global.optionalCoverages[i].price;
      option.value = this.global.optionalCoverages[i].coverageOption;
      optionalCoverageSelect.add(option);
      options.push(option.text);
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
      if(this.global.promo == null) {
        this.validPromo = true;
      }
      var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
      var promoInputValue = promoInput.value;
      var promoStatus = document.getElementById('promo-status');
      if(promoInputValue) {
          if(this.global.promo != null) {
              if(this.global.promo.type = 'Free Coverage Multi' ) {
                let code1 = this.global.promo.code.substring(0, this.global.promo.code.indexOf(','));
                let code2 = this.global.promo.code.substring(this.global.promo.code.indexOf(',') + 1);
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
              } else if(this.global.promo.code === promoInputValue) {
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

      if(this.validPromo && this.global.promo.active && this.global.promo.type == 'Free Coverage') {
        for(var i = 0; i < this.optionalCoverageMultiSelect.options.items.size; i++) {
          let value = this.optionalCoverageMultiSelect.options.items.get(i).value;
          if(value.toString().includes(this.global.promo.coverage)) {
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
      } else if(this.validPromo && this.global.promo.active && this.global.promo.type == 'Free Coverage Multi') {
        for(var i = 0; i < this.optionalCoverageMultiSelect.options.items.size; i++) {
          let value = this.optionalCoverageMultiSelect.options.items.get(i).value;

          let coverage1 = this.global.promo.coverage.substring(0, this.global.promo.coverage.indexOf(','));

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
      this.orderForm.controls.optionalCoverage.setValue(selectedOptions.toString());

      let selectedSpecialRequests = [];
      for(let i = 0; i < this.global.specialRequests.length; i++) {
        var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
        if(specialRequest.checked) {
          selectedSpecialRequests.push(this.global.specialRequests[i]);
        }
      }
      
      this.orderForm.controls.specialRequest.setValue(selectedSpecialRequests.toString());
      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.orderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.orderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var promoInput = document.getElementsByName('promo')[0] as HTMLInputElement;
      this.orderForm.controls.promo.setValue(promoInput.value);

      let today = new Date;
      this.orderForm.controls.createdDate.setValue(today);
      this.orderForm.controls.sendEmail.setValue(this.global.settings.sendEmail);
      this.orderForm.controls.adminName.setValue(this.global.settings.owner);
      this.orderForm.controls.adminEmail.setValue(this.global.settings.email);
      this.orderForm.controls.orderTotal.setValue("$" + this.total);

      this.orderForm.controls.userId.setValue(this.global.currentUser != null ? this.global.currentUser.userId : null);

      if(!this.global.testing) {
        this.global.hwaPlaceOrder(this.orderForm, "BUYER");

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
          if(this.global.currentUser != null) {
            this.toggleActive('LOGIN');
            this.orderForm.controls.name.setValue(this.global.currentUser.name);
            this.orderForm.controls.email.setValue(this.global.currentUser.email);
            this.orderForm.controls.userId.setValue(this.global.currentUser.userId);
            this.progressStep++; 
            break;
          }

          // validate login
          if(this.active == 'LOGIN') {
            let username = document.getElementById('login-username') as HTMLInputElement;
            let password = document.getElementById('login-password') as HTMLInputElement;

            this.global.hwaLogin(username.value, password.value);
            
          } else if(this.active == 'REGISTER') {
            let regName = document.getElementById('register-name') as HTMLInputElement;
            let regEmail = document.getElementById('register-email') as HTMLInputElement;
            let regUsername = document.getElementById('register-username') as HTMLInputElement;
            let regPassword = document.getElementById('register-password') as HTMLInputElement;

            // register 
            if( (regName.value != null && regName.value != '') &&
                (regEmail.value != null && regEmail.value != '') &&
                (regPassword.value != null && regPassword.value != '')) {

                this.registerLogin = {
                  username: regEmail.value,
                  password: regPassword.value
                };

                // register
                this.register.registerUser(regName.value, regEmail.value, regUsername.value, regPassword.value);

                this.orderForm.controls.name.setValue(regName.value);
                this.orderForm.controls.email.setValue(regEmail.value);

            } else {
              // let user know they are missing info for register
              console.log('info missing...');
            }
            
          } else {
            this.validateName = true;
            this.validateEmail = true;
          }
        } else if(this.progressStep == 3) {
          this.validateDate = true;
        }

        console.log(this.orderForm);
        
        if( (this.progressStep != 1 && this.progressStep != 3) || 
        //guest checkout and email/name valid
        (this.progressStep == 1 && this.active == 'GUEST' && this.orderForm.controls.email.valid && this.orderForm.controls.name.valid) ||
        //login and status = successful
        (this.progressStep == 1 && this.active == 'LOGIN' && this.orderForm.controls.email.valid && this.orderForm.controls.name.valid) ||
        (this.progressStep == 1 && this.active == 'REGISTER') ||
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

  login() {
    let username = document.getElementById('login-username') as HTMLInputElement;
    let password = document.getElementById('login-password') as HTMLInputElement;

    this.global.hwaLogin(username.value, password.value);
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
      case "GOLD": {
        this.total += (isTownhome) ? 
        +(this.global.plans[0].plan.price - this.global.plans[0].plan.townhomeDiscount) :
        +this.global.plans[0].plan.price; 
        break;
      }
      case "PLATINUM": {
        this.total += (isTownhome) ? 
        +(this.global.plans[1].plan.price - this.global.plans[1].plan.townhomeDiscount) :
        +this.global.plans[1].plan.price; 
        break;
      }
      case "DIAMOND": {
        this.total += (isTownhome) ? 
        +(this.global.plans[2].plan.price - this.global.plans[2].plan.townhomeDiscount) :
        +this.global.plans[2].plan.price; 
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

    if(this.global.promo.active && this.validPromo && this.orderForm.controls.promo.value != '' && this.global.promo.type == 'Money Off') {
      this.total -= +this.global.promo.amount;
    }

    var optionalCoverageSelect = document.getElementById('optional-coverage') as HTMLSelectElement;
      for(var i = 0; i < optionalCoverageSelect.options.length; i++) {
        if(optionalCoverageSelect.options[i].selected) {
          let option = optionalCoverageSelect.options[i].text;
          let price = option.substring(option.indexOf("$") + 1, option.lastIndexOf("/"));
          if(!this.validPromo) {
            this.total += +price;
          } else {
            if(this.global.promo.type == 'Free Coverage' && this.orderForm.controls.promo.value != '') {
              if(!option.includes(this.global.promo.coverage)) {
                this.total += +price;
              }
            } else if(this.global.promo.type == 'Free Coverage Multi' && this.orderForm.controls.promo.value != '') {
              let coverage1 = this.global.promo.coverage.substring(0, this.global.promo.coverage.indexOf(','));
              let coverage2 = this.global.promo.coverage.substring(this.global.promo.coverage.indexOf(',') + 1);
              let code1 = this.global.promo.code.substring(0, this.global.promo.code.indexOf(','));
              let code2 = this.global.promo.code.substring(this.global.promo.code.indexOf(',') + 1);

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

    switch(active) {
      case "GUEST": {
        this.active = active;
        loginRegisterBox.style.opacity = '0.25'; 
        guestCheckoutBox.style.opacity = '1.0'; 
        guestCheckoutBox.style.background = "#eee"
      } break;
      case "LOGIN":
      case "REGISTER": {
        this.active = this.panel;
        guestCheckoutBox.style.opacity = '0.25'; 
        loginRegisterBox.style.opacity = '1.0'; 
        loginRegisterBox.style.background = "#eee"
      } break;
    }
  }

  isLoginActive() {
    // if logged in -> proceed next
    if(this.global.currentUser != null && this.progressStep == 1) {
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

}
