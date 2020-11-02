import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    password: new FormControl(),
    email: new FormControl(),
    fromEmail: new FormControl(),
    adminName: new FormControl()
  });

  passwordResetSent: boolean;

  passwordResetStatus = {
    sent: false,
    error: false
  };

  panel = "LOGIN";

  constructor(public global: GlobalService, private database: DatabaseService, public router: Router) { }

  ngOnInit() {
    this.passwordResetStatus = {
      sent: false,
      error: false
    };
  }

  resetPassword() {
    let username = document.getElementById('username') as HTMLInputElement;

    return this.database.HwaPasswordReset(username.value).subscribe(response => {
      this.passwordResetStatus = {
        sent: true,
        error: false
      };
    },
      error => {
        console.log(error);
        this.passwordResetStatus = {
          sent: false,
          error: true
        };
      }
    );
  }

  checkKey(event) {
    if(event.key === 'Enter') {
      this.tryLoginRegister();
    } else {
      if(this.panel == 'LOGIN') {
        if(event.target.id == 'username' && (this.global.loginStatus == 'USER_REQUIRED' || this.global.loginStatus == 'BAD_USER')) {
          this.global.loginStatus = "";
        } else if(event.target.id == 'password' && this.global.loginStatus == 'BAD_PASS') {
          this.global.loginStatus = "";
        } 
      } else {
        if(event.target.id == 'reg-name' && this.global.registerStatus == 'NAME_REQUIRED') {
          this.global.registerStatus = "";
        } else if(event.target.id == 'reg-email' && (this.global.registerStatus == 'EMAIL_REQUIRED' || this.global.registerStatus =='EMAIL_EXISTS')) {
          this.global.registerStatus = "";
        } else if(event.target.id == 'reg-password' && (this.global.registerStatus == 'PASS_REQUIRED')) {
          this.global.registerStatus = "";
        }
      }
    }
  }

  tryLoginRegister() {
    if(this.panel == 'LOGIN') {
      let username = document.getElementById('username') as HTMLInputElement;
      let password = document.getElementById('password') as HTMLInputElement;

      if(username.value == null || username.value == '') {
        this.global.loginStatus = 'USER_REQUIRED';
      } else {
        this.global.hwaLogin(username.value, password.value);
      }
    } else {
      let name = document.getElementById('reg-name') as HTMLInputElement;
      let email = document.getElementById('reg-email') as HTMLInputElement;
      let username = document.getElementById('reg-username') as HTMLInputElement;
      let password = document.getElementById('reg-password') as HTMLInputElement;

      if(name.value == null || name.value == '') {
        this.global.registerStatus = 'NAME_REQUIRED';
      } else if(email.value == null || email.value == '') {
        this.global.registerStatus = 'EMAIL_REQUIRED';
      } else if(password.value == null || password.value == '') {
        this.global.registerStatus = 'PASS_REQUIRED';
      } else {
        let user = {
          name: name.value,
          email: email.value,
          username: username.value,
          password: password.value
        };
  
        this.global.hwaRegisterUser(user);
      }
    }
  }

  flip() {
    let card = document.getElementById('flip-card');
    if(card.classList.contains('flip')) {
      card.classList.remove('flip');
      this.panel = "LOGIN";
      let name = document.getElementById('reg-name') as HTMLInputElement;
      let email = document.getElementById('reg-email') as HTMLInputElement;
      let username = document.getElementById('reg-username') as HTMLInputElement;
      let password = document.getElementById('reg-password') as HTMLInputElement;
      name.value = '';
      email.value = '';
      username.value = '';
      password.value = '';
      this.global.registerStatus = "";
    } else {
      card.classList.add('flip');
      this.panel = "REGISTER";
      this.global.loginStatus = "";
    }
  }

}
