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
      this.tryLogin();
    }
  }

  tryLogin() {
    let username = document.getElementById('username') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;
    this.global.hwaLogin(username.value, password.value);
  }

}
