import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_URL } from '../../app/config';
import 'rxjs/add/operator/map';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;
  //http: Http;

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

  public login(credentials) {
     if (credentials.email === null || credentials.password === null) {
       return Observable.throw("Please insert credentials");
     } else {
       return Observable.create(observer => {
         this.http.get(SERVER_URL + 'iframe/?domain=mb&L=en&id=login&nolinks=1&bubimobil=1&redirect_account=https://templates.nextbike.net/bubi2014/bubi_mobil/account.html&redirect_index=https://templates.nextbike.net/bubi2014/bubi_mobil/bubi.html&logintype=login&user=' + credentials.email + '&pass=' + credentials.password).subscribe(data => {
            console.log("Request successful, returned data:");
            console.log(data);
            let access = false;
            console.log(data.text());
            if(data.text().indexOf("https://templates.nextbike.net/bubi2014/bubi_mobil/account.html") !== -1) {
              access = true;
              this.currentUser = new User("Username of " + credentials.email, credentials.email);
            }
            observer.next(access);
            observer.complete();
         });
       });
     }
  }

  public getUserInfo() : User {
     return this.currentUser;
  }

  public logout() {
     return Observable.create(observer => {
       this.currentUser = null;
       observer.next(true);
       observer.complete();
     });
  }
}
