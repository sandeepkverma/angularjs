import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {PlaceComponent} from './place.component';
import {NearComponent} from './near.component';
import {DirectionComponent} from './direction.component';

const routes:Routes = [
{path:'',redirectTo:'/place',pathMatch:'full'},
{path:'place',component:PlaceComponent},
{path:'near',loadChildren:'./app/near.module#NearModule'},
{path:'direction',loadChildren:'./app/direction.module#DirectionModule'}
]

 

@NgModule({
	imports:[RouterModule.forRoot(routes)],
	exports:[RouterModule]
})


export class AppRoutingModule {}