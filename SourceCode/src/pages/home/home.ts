import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
declare var google: any;
import * as firebase from 'Firebase';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  ref = firebase.database().ref('geolocations/');
  private refLoc = firebase.database().ref('drone/');
  distance = 10;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device, public menu: MenuController) {
      this.menu.enable(true, 'menu');
    platform.ready().then(() => {
      this.initMap(this.distance);
    });
    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if(data.uuid !== this.device.uuid) {
          
          let image = 'assets/imgs/marker.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          //this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/marker.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          //this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        }
      });
    })
  }
  updateMap(){
    var zoomlevel = this.getZoomLevel(this.distance);
    //console.log(zoomlevel);
    this.initMap(zoomlevel);
  }
  getZoomLevel(distance) {
    if (distance != null){
        var zoomLevel =(Math.log2(40225/distance));
    }
    return zoomLevel;
}
  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }
  initMap(zoomLevel) {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: zoomLevel,
        center: mylocation,
      });
    }).catch((error)=>{

      console.log('Error getting location', error);
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      this.deleteMarkers();
      this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      //console.log(data.coords.latitude)
      let image = 'assets/imgs/marker.png';
      //this.addMarker(updatelocation,image);
      this.refLoc.once('value', (snapshot) => {
        snapshot.forEach(drone => {
          let updatelocation = new google.maps.LatLng(drone.val().latitude, drone.val().longtitude);
          
          let image = 'assets/imgs/marker.png';
          this.addMarker(updatelocation, image);
          return false;
        }); 
      });
      this.setMapOnAll(this.map);
    });
  }
  addMarker(location, image) {
    //console.log(location)
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  
}
export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};