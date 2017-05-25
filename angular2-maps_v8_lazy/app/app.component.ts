import {Component,OnInit} from '@angular/core';

import {MapUtil} from './maputil';

@Component({
	selector:'my-app',
	template:`
	<h1>{{title}}</h1>

	<nav>
	<side-menu></side-menu>
	<a routerLink="/place" routerLinkActive="active">place</a>
	<a routerLink="/near" routerLinkActive="active">Near</a>
	<a routerLink="/direction" routerLinkActive="active">Direction</a>
	</nav>
	<router-outlet></router-outlet>
	<div id="map"></div>
	`,
	styleUrls:['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'maps demo'; 	
	map = {};

	constructor(private mapUtil:MapUtil){}

	inIt():void {
	 var centre = new L.LatLng(28.61, 77.23);
        this.map=new MapmyIndia.Map('map',{center:centre,zoomControl: true,hybrid:true });
        /*1.create a MapmyIndia Map by simply calling new MapmyIndia.Map() and passsing it at the minimum div object, all others are optional...
          2.all leaflet mapping functions can be called simply on the L object
          3.MapmyIndia may extend and in future modify the customised/forked Leaflet object to enhance mapping functionality for developers, which will be clearly documented in the MapmyIndia API documentation section.*/
        var marker=L.marker(centre).addTo(this.map);/**--add marker at the centre of map--**/
        marker.bindPopup('Hello World');
	}
	ngOnInit():void {
	 this.inIt();
	// this.mapUtil.loadMap(); 
	}


}