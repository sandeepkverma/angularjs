import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';


import {Constant} from '../constants';

@Injectable()
export class SideMenuService{
	
	private liveDataUrl = 'https://intouch.mapmyindia.com/IntouchAPI/mobileAPI/getlivedata?state=0&token='+Constant.TOKEN+'';


	constructor(private http:Http){}

	getLiveData():Promise<any>{
		return this.http.get(this.liveDataUrl).toPromise().then(response => response.json().data).catch(this.handleError);
	}

	private handelError(error:any):Promise<any>{
	console.error('An error occured',error);

	return Promise.reject(error.message || error);

	}
}