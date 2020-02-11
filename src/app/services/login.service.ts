import { Injectable } from '@angular/core';

const username = 'Anne.Lang';
const password = 'Regina23!';

@Injectable()
export class LoginService {

  status = { 
    bad_user: null, 
    bad_pass: null, 
    successful: false 
  };

  constructor() { }

  login(user: string, pass: string): any {
    if(user == username && pass == password) {
      this.status = { 
        bad_user: false, 
        bad_pass: false, 
        successful: true 
      };
      //return this.status;
    } else {
      this.status = { 
        bad_user: user != username ? true : false, 
        bad_pass: pass != password ? true : false, 
        successful: false 
      };
      //return this.status;
    }
  }

  get getStatus() {
    return this.status;
  }
}
