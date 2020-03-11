import { Injectable } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { DatabaseService } from '../services/database.service';

@Injectable()
export class LoginService {

  status = { 
    bad_user: null, 
    bad_pass: null, 
    successful: false 
  };

  constructor(private global: GlobalService, private database: DatabaseService) { }

  login(user: string, pass: string): any {
    if(user == this.global.getLogin.username && pass == this.global.getLogin.password) {
      this.status = { 
        bad_user: false, 
        bad_pass: false, 
        successful: true 
      };
    } else {
      this.status = { 
        bad_user: user != this.global.getLogin.username ? true : false, 
        bad_pass: pass != this.global.getLogin.password ? true : false, 
        successful: false 
      };
    }
  }

  get getStatus() {
    return this.status;
  }
}
