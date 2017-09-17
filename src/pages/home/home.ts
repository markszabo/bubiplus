import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, IonicPage, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { SERVER_URL } from '../../app/config';
import htmlparser from 'htmlparser';

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
       //console.log(data);
       //console.log(data.text());
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
          if (error)
              console.log("error");
          else
              console.log("parsing done");
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(data.text());
        let body_index=0;
        while(handler.dom[2]['children'][body_index].name !== "body")
          body_index++;
        let id_Content_index = 0;
        while(handler.dom[2]['children'][body_index]['children'][id_Content_index]['raw'] !== "div id=\"Content\"")
          id_Content_index++;
        let tag_id1_index = 0;
        while(handler.dom[2]['children'][body_index]['children'][id_Content_index]['children'][tag_id1_index]['type'] !== "tag")
          tag_id1_index++;
        let tag_id2_index = 0;
        while(handler.dom[2]['children'][body_index]['children'][id_Content_index]['children'][tag_id1_index]['children'][tag_id2_index]['type'] !== "tag")
          tag_id2_index++;
        let customer_balance_index = 0;
        while(handler.dom[2]['children'][body_index]['children'][id_Content_index]['children'][tag_id1_index]['children'][tag_id2_index]['children'][customer_balance_index]['raw'] !== "div class=\"customer_balance\"")
          customer_balance_index++;
        console.log(JSON.stringify(handler.dom[2]['children'][body_index]['children'][id_Content_index]['children'][tag_id1_index]['children'][tag_id2_index]['children'][customer_balance_index]['children'], null, 2).substring(0,10000));
        console.log(handler.dom);
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
