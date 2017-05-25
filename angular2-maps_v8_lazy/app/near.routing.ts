import {ModuleWithProviders} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';



import {NearComponent} from './near.component';

const routes:Routes = [
	{path:'',component:NearComponent}
]


export const routing:ModuleWithProviders = RouterModule.forChild(routes);