import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(public login: LoginService, private global: GlobalService, private database: DatabaseService, public router: Router) { }

  ngOnInit() {
    this.passwordResetSent = false;
  }

  passwordReset() {
    let randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let newPassword = btoa(randomString);

    this.resetPasswordForm.controls.password.setValue(newPassword);
    this.resetPasswordForm.controls.email.setValue(this.global.settings.email);
    this.resetPasswordForm.controls.fromEmail.setValue(this.global.settings.passwordResetEmail);
    this.resetPasswordForm.controls.adminName.setValue(this.global.settings.owner);
    return this.database.resetPassword(this.resetPasswordForm).subscribe(
      response => {
        this.passwordResetSent = true;
      },
      error => console.log(error)
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
