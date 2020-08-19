import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { CameraPage } from '../pages/camera/camera';
import { ListPage } from '../pages/list/list';
import { DroneregisterPage } from '../pages/droneregister/droneregister';
import { MyProfilePage } from '../pages/my-profile/my-profile';
const config = {
   //Your key here
};
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = DroneregisterPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
     private storage: Storage, public loadingCtrl: LoadingController, public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config); 
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

  goTo(page: string){
    if(page === "map"){
      this.nav.setRoot(HomePage);
      this.presentLoading();
    }
    else if(page === "list"){
      this.nav.setRoot(ListPage);
      this.presentLoading();
    }
    else if(page === "register"){
      this.nav.setRoot(DroneregisterPage);
    }
    else if(page === "camera"){
      this.nav.setRoot(CameraPage);
    }
    else if(page === "edit"){
      this.nav.setRoot(MyProfilePage);
    }
    this.menu.close();
  }
  logout(){
    this.storage.remove('user');
    this.nav.setRoot(LoginPage);
    this.menu.close();
  }
}

