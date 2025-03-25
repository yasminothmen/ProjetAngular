import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassesComponent} from "./classes/classes.component";
import {ListeclassesComponent} from "./listeclasses/listeclasses.component";
import {ClassedetailsComponent} from "./classedetails/classedetails.component";
import {HeaderfooterComponent} from "./headerfooter/headerfooter.component";
import { ElevesComponent } from './eleves/eleves.component';
import { ListelevesComponent } from './listeleves/listeleves.component';
import { MatiereComponent } from './matieres/matieres.component';
import { ListematieresComponent } from './listematieres/listematieres.component'; // Assurez-vous du bon chemin
import { EnseignantsComponent } from './enseignants/enseignants.component';
import { ListeenseignantsComponent } from './listeenseignants/listeenseignants.component';
import { EmploiComponent } from './emploi/emploi.component';
import { EmploiAffichageComponent } from './affiche-emploi/affiche-emploi.component';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authenticatedGuard, notAuthenticatedGuard, verifyEmailGuard } from './guards/authenticated.guard';

const routes: Routes = [
  { path:'acceuil',
    component : HeaderfooterComponent,
    children:[
      {path:'classe', component:ClassesComponent},
      {path:'classeslist',component:ListeclassesComponent},
      {path:'classe/:id',component:ClassedetailsComponent},
            //******************* */
      {path:'eleves',component:ElevesComponent},
      {path:'elevesList',component:ListelevesComponent},
      /************************** */
      {path:'matieres',component:MatiereComponent},
      {path:'listematieres',component:ListematieresComponent},

      //**************************************** */
      { path: 'enseignants', component: EnseignantsComponent },
      { path: 'listeenseignants',component:ListeenseignantsComponent},

      // ********************************************
      { path: 'emploie', component: EmploiComponent },
      { path: 'afficheEmploie', component: EmploiAffichageComponent },

      // ***********************************************/
      {path: 'login', component : LoginComponent, canActivate: [notAuthenticatedGuard]},
      {path: 'verify-email', component : VerifyEmailComponent, canActivate: [verifyEmailGuard]},
   
      { path: 'dashboard', component: DashboardComponent, canActivate: [authenticatedGuard]},
    ]},

    { path: '', redirectTo: '/acceuil/classeslist', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
