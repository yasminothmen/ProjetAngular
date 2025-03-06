import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassesComponent} from "./classes/classes.component";
import {ListeclassesComponent} from "./listeclasses/listeclasses.component";
import {ClassedetailsComponent} from "./classedetails/classedetails.component";
import {HeaderfooterComponent} from "./headerfooter/headerfooter.component";

const routes: Routes = [
  { path:'acceuil',
    component : HeaderfooterComponent,
    children:[
      {path:'classe', component:ClassesComponent
      },
      {path:'classeslist',component:ListeclassesComponent},
      {path:'classe/:id',component:ClassedetailsComponent},
    ]},

  {path:'',redirectTo:'/classeslist',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
