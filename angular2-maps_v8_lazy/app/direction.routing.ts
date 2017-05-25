import {ModuleWithProvider} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {DirectionComponent} from './direction.component';
const routes:Routes =[
{path:'',component:DirectionComponent}
]


export const routing:ModuleWithProvider = RouterModule.forChild(routes);