import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassesComponent } from './classes/classes.component';
import { ListeclassesComponent } from './listeclasses/listeclasses.component';
import { ClassedetailsComponent } from './classedetails/classedetails.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderfooterComponent } from './headerfooter/headerfooter.component';
import { ElevesComponent } from './eleves/eleves.component';
import { ListelevesComponent } from './listeleves/listeleves.component';
import { MatIconModule } from '@angular/material/icon';
import { MatiereComponent } from './matieres/matieres.component';
import { ListematieresComponent } from './listematieres/listematieres.component';
import { EnseignantsComponent } from './enseignants/enseignants.component';
import { ListeenseignantsComponent } from './listeenseignants/listeenseignants.component';

@NgModule({
  declarations: [
    AppComponent,
    ClassesComponent,
    ListeclassesComponent,
    ClassedetailsComponent,
    HeaderComponent,
    FooterComponent,
    HeaderfooterComponent,
    ElevesComponent,
    ListelevesComponent,
    MatiereComponent,
    ListematieresComponent,
    EnseignantsComponent,
    ListeenseignantsComponent,
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,// ne5ou bih les api mil back
    ReactiveFormsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
