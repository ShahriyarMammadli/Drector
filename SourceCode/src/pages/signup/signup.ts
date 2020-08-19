
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import * as firebase from 'Firebase';
import { LoginPage } from '../login/login';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private model: any = {};
  private ref = firebase.database().ref('user/');
  private isEnabled = false;
  private userID;
  constructor(public nav: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }
  ionViewDidLoad(){
    this.ref.on("value", (snapshot) => {
      this.userID = snapshot.numChildren();
    })
    //<-ID SET

    this.validationSignup();
    /*if(this.passMatch(this.model.password, this.model.rpassword))
      this.isEnabled = true;
      console.log(this.isEnabled)*/
    //<-check whether password matches
  }
  signUp(){
    firebase.database().ref('user/'+this.userID).set({
      id: this.userID,
      fullname: this.model.fullname,
      email: this.model.email,
      username: this.model.username,
      password: this.model.password
    });
    this.doAlert();
    this.goToLogin();
  }

  goToLogin(){
    this.nav.push(LoginPage);
  }//<- go to login page

  doAlert() {
    let alert = this.alertCtrl.create({
      title: 'SignUp',
      subTitle: 'SignUp has completed succesfully! Please Login!',
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
  public validationSignup(){
    if(this.passMatch(this.model.password, this.model.rpassword))
      this.isEnabled = true;
    else
      this.isEnabled = false;
    console.log(this.isEnabled)
  }
}
