import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, IonicPage, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { SERVER_URL } from '../../app/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = '';
  email = '';
  loading: Loading;

  constructor(private nav: NavController, private auth: AuthServiceProvider, private loadingCtrl: LoadingController, public http: Http) {
    let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];
    console.log('getting trip data');
    this.showLoading("Getting trip data");
    this.http.get(SERVER_URL + 'iframe/?domain=mb&L=en&id=account&nolinks=1&bubimobil=1&redirect_account=https://templates.nextbike.net/bubi2014/bubi_mobil/account.html&redirect_index=https://templates.nextbike.net/bubi2014/bubi_mobil/bubi.html').subscribe(data => {
       console.log("Request successful, returned data:");
       console.log(data);
       console.log(data.text());
       this.loading.dismiss();
     });
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot(LoginPage);
    });
  }

  showLoading(content: string) {
    this.loading = this.loadingCtrl.create({
      content: content,
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
