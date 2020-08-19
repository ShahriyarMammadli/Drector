import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
/**
 * Generated class for the DroneregisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-droneregister',
  templateUrl: 'droneregister.html',
})
export class DroneregisterPage {
  private regiterType = 'bookmark';
  private options: BarcodeScannerOptions;
  private encodText: string = '';
  private encodedData: any = {};
  private scannedData: any = {};
  //<- QR
  constructor(public navCtrl: NavController, public navParams: NavParams, private scanner: BarcodeScanner) {
  }
  ionViewDidLoad() {
    //nothing
  }
  scan(){
    this.options = {
      prompt: 'Scan the barcod'
    };
    this.scanner.scan().then((data) => {
      this.scannedData = data;
    }, (err) => {
      console.log('Error: '+err);
    });
  }
  encode(){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodText).then((data) => {
      this.encodedData = data;
    }, (err) => {
      console.log('Error: '+err);
    });
  }
}
