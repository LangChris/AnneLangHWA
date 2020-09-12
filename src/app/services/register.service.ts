import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  status = { 
    successful: false 
  };

  constructor(public global: GlobalService, private database: DatabaseService) { }

  registerUser(name: string, email: string, username: string, pass: string): any {
    
    let foundUser: any = null;
    for(let i = 0; i < this.global.getUsers.length; i++) {

      if( (email.toUpperCase() == this.global.getUsers[i].email.toUpperCase()) ||
      (username != null && username.toUpperCase() == this.global.getUsers[i].username.toUpperCase())) {
        foundUser = this.global.getUsers[i];
        break;
      }
    }
    

    if(foundUser != null) {
      // user already exists
      this.status = {
        successful: false
      };

    } else {
      // register user
      let user = {
        usersType: "USER",
        usersName: name,
        emailAddress: email,
        loginUsername: username,
        loginPassword: btoa(pass)
      };

      if(!this.global.testing) {
        return this.database.saveUser(user).subscribe(response => {
          this.status = {
            successful: true
          };
        }, error => {
          console.log(error);
          this.status = {
            successful: false
          };
        });
      } else {
        this.status = {
          successful: true
        };
      }
    }
    
  }

  get getStatus() {
    return this.status;
  }
}
