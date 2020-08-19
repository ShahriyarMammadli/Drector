import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  @ViewChild(Slides) slides: Slides;
  private model: any = {};
  private modelLogin: any = {};
  private protectedPassword;
  private ref = firebase.database().ref('user/');
  constructor(public navCtrl: NavController, public navParams: NavParams,
     private storage: Storage, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.storage.get('fullname').then((val) => {
      this.model.fullname = val;
    });
    this.storage.get('username').then((val) => {  
      this.model.username = val;
    });
    this.storage.get('email').then((val) => {
      this.model.email = val;
    });
    this.storage.get('password').then((val) => {
      this.protectedPassword = val;
    });
    this.storage.get('id').then((val) => {
      this.model.id = val;
    });
    this.model.oldpassword = "";
  }
  goToSlide(num) {
    this.slides.slideTo(num, 500);
  }
  editProfile(){
    firebase.database().ref('user/'+this.model.id).set({
      id: this.model.id,
      fullname: this.model.fullname,
      email: this.model.email,
      username: this.model.username,
      password: this.protectedPassword
    });
    this.doAlertForUpdate();
    this.setLocalStorage();
    this.navCtrl.push(HomePage);
  }
  changePassword(){
    //console.log(this.protectedPassword)
    //console.log(this.model.oldpassword)
    if(this.model.oldpassword === this.protectedPassword){
      if(this.passMatch(this.model.newpassword, this.model.newrpassword)){
        firebase.database().ref('user/'+this.model.id).set({
          id: this.model.id,
          fullname: this.model.fullname,
          email: this.model.email,
          username: this.model.username,
          password: this.model.newpassword
        });
        this.doAlertForPassword();
        this.setLocalStorage();
        this.protectedPassword = this.model.newpassword;
      }
      else{
        this.doAlertForMismatch();
      }
    }
    else{
      this.doAlertForWrongPassword();
    }
    this.navCtrl.push(HomePage);
  }
  doAlertForMismatch(){
    let alert = this.alertCtrl.create({
      title: 'Mismatch',
      subTitle: 'Passwords do not match!',
      buttons: ['Try Again']
    });
    alert.present();
  }
  doAlertForWrongPassword(){
    let alert = this.alertCtrl.create({
      title: 'Wrong Passwordd',
      subTitle: 'Password you entered does not match with current password',
      buttons: ['Try Again']
    });
    alert.present();
  }
  doAlertForUpdate() {
    let alert = this.alertCtrl.create({
      title: 'Profile Edition',
      subTitle: 'Profile has updated succesfully!',
      buttons: ['Ok']
    });
    alert.present();
  }
  doAlertForPassword() {
    let alert = this.alertCtrl.create({
      title: 'Password Change',
      subTitle: 'Password has updated succesfully!',
      buttons: ['Ok']
    });
    alert.present();
  }
  passMatch(password: string, repeated: string){
    if(password != undefined && repeated != undefined){
    if(password === repeated)
      return true;
    else
      return false;
    }
  }
  setLocalStorage(){
    this.storage.set('fullname', this.model.fullname);
    this.storage.set('username', this.model.username);
    this.storage.set('email', this.model.email);
    this.storage.set('password', this.model.password);
    this.storage.set('id', this.model.id);
  }
}
