import {NgModule}  from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';


import {AppComponent} from './app.component';
import {MapUtil} from './maputil';
import {AppRoutingModule} from './app-routing.module';
import {PlaceComponent} from './place.component';
import {SideMenuComponent} from './sidemenu/sidemenu.component';
import {SideMenuService} from './sidemenu/sidemenu.service';

 

@NgModule({
	imports:[
	BrowserModule,
	FormsModule,
	HttpModule,
	AppRoutingModule
	],
	declarations:[AppComponent,PlaceComponent,SideMenuComponent],
	providers:[SideMenuService,MapUtil],
	bootstrap:[AppComponent]
})

   
export class AppModule {}