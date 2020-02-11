import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public login: LoginService) { }

  ngOnInit() {
  }

  tryLogin() {
    let username = document.getElementById('username') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;
    this.login.login(username.value, password.value);
  }

}
