import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  private drones = [];
  private ref = firebase.database().ref('drone/');
  private currentLocation: any= {};
  private model: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.latitude = resp.coords.latitude;
      this.currentLocation.longtitude = resp.coords.longitude;
      this.findDronesInDistance(0);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  findDronesInDistance(distance){
    this.ref.once('value', (snapshot) => {
      snapshot.forEach(user => {
        var distance = this.getDistanceFromLatLonInKm(user.val().latitude, user.val().longtitude, 
        this.currentLocation.latitude, this.currentLocation.longtitude);
        this.model = user.val();
        this.model.distance = distance;
        this.drones.push(this.model);
        return false;
      }); 
    });
}
getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {

  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km 
  return d.toFixed(3);
 }
  deg2rad(deg) {
  return deg * (Math.PI/180)
 }
}
