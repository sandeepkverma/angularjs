import {NgModule} from '@angular/core';

import {DirectionComponent} from './direction.component';
import {routing} from './direction.routing';

@NgModule({
	imports:[routing],
	declarations:[DirectionComponent]
})



export class DirectionModule{}