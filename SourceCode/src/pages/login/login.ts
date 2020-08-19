import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import { MenuController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private ref = firebase.database().ref('user/');
  private model: any = {};
  private fakeUserModel: any = {};
  //<-initialization
  constructor(private nav: NavController, public menu: MenuController,
     public alertCtrl: AlertController, private storage: Storage, public loadingCtrl: LoadingController) {
    this.menu.enable(false, 'menu');
  }
  doLogin(){
    this.ref.once('value', (snapshot) => {
      snapshot.forEach(user => {
        if(user.val().email  === this.model.email){
          this.fakeUserModel.fullname = user.val().fullname;
          this.fakeUserModel.username = user.val().username;
          this.fakeUserModel.password = user.val().password;
          this.fakeUserModel.email = user.val().email;
          this.fakeUserModel.id = user.val().id;

          this.storage.set('fullname', this.fakeUserModel.fullname);
          this.storage.set('username', this.fakeUserModel.username);
          this.storage.set('email', this.fakeUserModel.email);
          this.storage.set('password', this.fakeUserModel.password);
          this.storage.set('id', this.fakeUserModel.id);
        
          return false;
        }
        return;
      });
    });
    if(this.fakeUserModel.password === this.fakeUserModel.password){
      this.goToHomePage();
      this.presentLoading();
    }//<-if inputs are correct login
    else if(this.fakeUserModel == undefined || this.fakeUserModel.password != this.model.password){
      this.storage.remove('fullname');
      this.storage.remove('username');
      this.storage.remove('email');
      this.storage.remove('password');
      this.storage.remove('id');
      this.doAlert();
    }//else alert
  }
  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }
  doAlert() {
    let alert = this.alertCtrl.create({
      title: 'Authentication Failed!',
      subTitle: 'Email or password you entered is not valid!',
      buttons: ['Try Again']
    });
    alert.present();
  }
  createAccount() {
    this.nav.push(SignupPage);
  }//<-go to login page
  goToHomePage(){
    this.nav.push(HomePage);
  }//<- go to home page when login is successful
}
