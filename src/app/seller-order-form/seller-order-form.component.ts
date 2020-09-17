import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { GlobalService } from '../services/global.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'; 
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-seller-order-form',
  templateUrl: './seller-order-form.component.html',
  styleUrls: ['./seller-order-form.component.css']
})
export class SellerOrderFormComponent implements OnInit {

  sellerOrderForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    plan: new FormControl(),
    years: new FormControl('13 Months'),
    homeType: new FormControl(),
    addressLine: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zip: new FormControl(),
    specialRequest: new FormControl(),
    sellerName: new FormControl(),
    sellerEmail: new FormControl(),
    sellerPhone: new FormControl(),
    startDate: new FormControl('', [Validators.required]),
    hvacCoverage: new FormControl(),
    realtorName: new FormControl(),
    realtorEmail: new FormControl(),
    realtorCompany: new FormControl(),
    realtorZip: new FormControl(),
    createdDate: new FormControl(),
    sendEmail: new FormControl(),
    adminName: new FormControl(),
    adminEmail: new FormControl(),
    orderTotal: new FormControl(),
    userId: new FormControl()
  }); 

  showForm = true;
  validateName = false;
  validateEmail = false;
  validateDate = false;

  total = 'FREE';

  progressStep = 1;

  helpClicked = false;

  panel = "LOGIN";

  active = "LOGIN";

  registerLogin = {
    username: "",
    password: ""
  };

  constructor(private database: DatabaseService, public global: GlobalService, private route: ActivatedRoute, private formBuilder: FormBuilder, private register: RegisterService) {}

  ngOnInit() {
    this.sellerOrderForm.controls.name.valueChanges.subscribe(value => {
      if(value) {
        var name = document.getElementById('name') as HTMLInputElement;
        name.style.border = "1px solid #ccc";
        this.validateName = false;
      }
    });

    this.sellerOrderForm.controls.email.valueChanges.subscribe(value => {
      if(this.sellerOrderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid #ccc";
        this.validateEmail = false;
      }
    });

    this.sellerOrderForm.controls.hvacCoverage.valueChanges.subscribe(value => {
      if(this.sellerOrderForm.controls.hvacCoverage.value == 'Yes') {
        this.total = '$50';
      } else {
        this.total = 'FREE';
      }
    });

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

  submitOrder() {
    if(this.sellerOrderForm.valid) {

      let selectedSpecialRequests = [];
      for(let i = 0; i < this.global.specialRequests.length; i++) {
        var specialRequest = document.getElementById('special-request-' + i) as HTMLInputElement;
        if(specialRequest.checked) {
          selectedSpecialRequests.push(this.global.specialRequests[i]);
        }
      }
      
      this.sellerOrderForm.controls.specialRequest.setValue(selectedSpecialRequests.toString());

      var plan = document.getElementById('plan') as HTMLSelectElement;
      this.sellerOrderForm.controls.plan.setValue(plan.value);

      var homeTypeSF = document.getElementById('home-type-sf') as HTMLInputElement;
      var homeTypeTH = document.getElementById('home-type-th') as HTMLInputElement;
      this.sellerOrderForm.controls.homeType.setValue(homeTypeSF.checked ? homeTypeSF.value : homeTypeTH.value);

      var hvacCoverage = document.getElementById('hvac-coverage') as HTMLSelectElement;
      this.sellerOrderForm.controls.hvacCoverage.setValue(hvacCoverage.value);

      let today = new Date;
      this.sellerOrderForm.controls.createdDate.setValue(today);
      this.sellerOrderForm.controls.sendEmail.setValue(this.global.settings.sendEmail);
      this.sellerOrderForm.controls.adminName.setValue(this.global.settings.owner);
      this.sellerOrderForm.controls.adminEmail.setValue(this.global.settings.email);
      this.sellerOrderForm.controls.orderTotal.setValue(this.total);

      this.sellerOrderForm.controls.userId.setValue(this.global.currentUser != null ? this.global.currentUser.userId : null);
      
      if(!this.global.testing) {
        this.global.hwaPlaceOrder(this.sellerOrderForm, "SELLER");

        return this.database.placeSellerOrder(this.sellerOrderForm).subscribe(response => {
          this.showForm = false;
        });
      } else {
        this.showForm = false;
      }
    } else {
      if(!this.sellerOrderForm.controls.email.valid) {
        var email = document.getElementById('email') as HTMLInputElement;
        email.style.border = "1px solid crimson";
        var location = this.getElementLocation(email);
        window.scrollTo(location.left, location.top);
      }
      if(!this.sellerOrderForm.controls.name.valid) {
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
            this.sellerOrderForm.controls.name.setValue(this.global.currentUser.name);
            this.sellerOrderForm.controls.email.setValue(this.global.currentUser.email);
            this.sellerOrderForm.controls.userId.setValue(this.global.currentUser.userId);
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

                this.sellerOrderForm.controls.name.setValue(regName.value);
                this.sellerOrderForm.controls.email.setValue(regEmail.value);

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

        console.log(this.sellerOrderForm);
        if( (this.progressStep != 1 && this.progressStep != 3) || 
        //guest checkout and email/name valid
        (this.progressStep == 1 && this.active == 'GUEST' && this.sellerOrderForm.controls.email.valid && this.sellerOrderForm.controls.name.valid) ||
        //login and status = successful
        (this.progressStep == 1 && this.active == 'LOGIN' && this.sellerOrderForm.controls.email.valid && this.sellerOrderForm.controls.name.valid) ||
        (this.progressStep == 1 && this.active == 'REGISTER') ||
        this.sellerOrderForm.valid) {
          this.progressStep++; 
        } else {
          if(!this.sellerOrderForm.controls.email.valid) {
            var email = document.getElementById('email') as HTMLInputElement;
            email.style.border = "1px solid crimson";
            var location = this.getElementLocation(email);
            window.scrollTo(location.left, location.top);
          }
          if(!this.sellerOrderForm.controls.name.valid) {
            var name = document.getElementById('name') as HTMLInputElement;
            name.style.border = "1px solid crimson";
            var location = this.getElementLocation(name);
            window.scrollTo(location.left, location.top);
          }
          if(this.progressStep == 3 && !this.sellerOrderForm.controls.startDate.valid) {
            var startDate = document.getElementById('startDate') as HTMLInputElement;
            name.style.border = "1px solid crimson";
            var location = this.getElementLocation(startDate);
            window.scrollTo(location.left, location.top);
          }
        }
      } break;
    }
  }

  toggleHelpClicked() {
    this.helpClicked = this.helpClicked ? false : true;
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

  login() {
    let username = document.getElementById('login-username') as HTMLInputElement;
    let password = document.getElementById('login-password') as HTMLInputElement;

    this.global.hwaLogin(username.value, password.value);
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
