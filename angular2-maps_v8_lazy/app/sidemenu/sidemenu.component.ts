import {Component} from '@angular/core';

import {SideMenuService} from './sidemenu.service';


 
@Component({
	selector:'side-menu',
	templateUrl:'./sidemenu.component.html',
	styleUrls:['./sidemenu.component.css']
})



export class SideMenuComponent {
	
	liveDatas:any;

	constructor(private sideMenuService:SideMenuService){}
	
	getLiveData():void{
		this.sideMenuService.getLiveData().then(liveDatas => {this.liveDatas = liveDatas;

		alert(JSON.stringify(this.liveDatas));

		})
	}
}