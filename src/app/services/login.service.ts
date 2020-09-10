import { Injectable } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginService {

  status = { 
    bad_user: null, 
    bad_pass: null, 
    successful: false 
  };

  currentUser: any;

  constructor(private global: GlobalService, private database: DatabaseService, public router: Router) { }

  login(user: string, pass: string): any {
    this.currentUser = null;

    let foundUser: any = null;
    for(let i = 0; i < this.global.getUsers.length; i++) {

      if(user.toUpperCase() == this.global.getUsers[i].username.toUpperCase() || user.toUpperCase() === this.global.getUsers[i].email.toUpperCase()) {
        foundUser = this.global.getUsers[i];
      }
    }
    

    if(foundUser != null) {
      if(btoa(pass) == foundUser.password) {
        this.currentUser = foundUser;
        this.status = { 
          bad_user: false, 
          bad_pass: false, 
          successful: true 
        };

        this.router.navigate(['dashboard']);
        
      } else {
        console.log('unsuccessful log in');
        this.status = { 
          bad_user: false, 
          bad_pass: true, 
          successful: false 
        };
      }
    } else {
      console.log('User not found.');
      this.status = { 
        bad_user: true, 
        bad_pass: false, 
        successful: false 
      };
    }
  }

  loginWithoutRedirect(user: string, pass: string): any {
    this.currentUser = null;

    let foundUser: any = null;
    for(let i = 0; i < this.global.getUsers.length; i++) {

      if(user.toUpperCase() == this.global.getUsers[i].username.toUpperCase() || user.toUpperCase() === this.global.getUsers[i].email.toUpperCase()) {
        foundUser = this.global.getUsers[i];
      }
    }

    if(foundUser != null) {
      if(btoa(pass) == foundUser.password) {
        this.currentUser = foundUser;
        this.status = { 
          bad_user: false, 
          bad_pass: false, 
          successful: true 
        };
        
      } else {
        console.log('unsuccessful log in');
        this.status = { 
          bad_user: false, 
          bad_pass: true, 
          successful: false 
        };
      }
    } else {
      console.log('User not found.');
      this.status = { 
        bad_user: true, 
        bad_pass: false, 
        successful: false 
      };
    }
  }

  get getStatus() {
    return this.status;
  }
}
