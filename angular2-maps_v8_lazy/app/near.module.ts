import {NgModule} from '@angular/core';



import {NearComponent} from './near.component';
import {routing} from './near.routing';

@NgModule({
	imports:[routing],
	declarations:[NearComponent]
})

export class NearModule{}