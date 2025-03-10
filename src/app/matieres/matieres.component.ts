import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatiereService } from '../services/matiere.service'; // Assurez-vous d'importer votre service
import { ClassesService } from '../services/classes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matiere',
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.scss']
})
export class MatiereComponent implements OnInit {

  matiereForm: FormGroup;
  classes: any[] = []; // Liste des classes
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService, // Service pour gérer les matières
    private classService: ClassesService, // Service pour gérer les classes
    private router: Router
  ) { 
    this.matiereForm = this.fb.group({
      name: ['', Validators.required], // Nom de la matière
      type: ['', Validators.required],  // Type (Obligatoire ou Optionnel)
      selectedClasses: [[], Validators.required] // Classes sélectionnées (tableau vide initialement)
    });
  }

  ngOnInit(): void {
    // Initialisation du formulaire
   

    // Récupérer les classes disponibles depuis le service
    this.classService.getAllClasses().subscribe(
      (data: any[]) => {
        this.classes = data;
      },
      (err) => {
        console.error('Erreur lors d\'ajout de classe', err);
        this.error = 'Erreur lors d\'ajout de classe';
      }
    );
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    if (this.matiereForm.valid) {
      // Récupérer les données du formulaire
      const matiereData = this.matiereForm.value;
  
      // Transformer 'selectedClasses' en 'classesIds' avant l'envoi
      matiereData.classesIds = matiereData.selectedClasses;  // Remplacer selectedClasses par classesIds
  
      // Supprimer le champ selectedClasses du formulaire avant l'envoi
      //delete matiereData.selectedClasses;
  
      console.log('Données envoyées à l\'API : ', matiereData); // Vérifie les données envoyées
  
      // Appeler le service pour enregistrer la matière
      this.matiereService.createSubject(matiereData).subscribe(
        (response) => {
          this.message = 'Matière ajoutée avec succès !';
           Swal.fire({
                      icon: 'success',
                      title: 'Ajout',
                      text: 'Matière ajoutée avec succès',
                      });
                      setTimeout(() => {
                        this.router.navigate(['acceuil/listematieres']);
                      }, 1000);
          this.matiereForm.reset(); // Réinitialiser le formulaire après ajout
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la matière', error);
          this.error = 'Erreur lors de l\'ajout de la matière.';
        }
      );
    } else {
      this.error = 'Le formulaire contient des erreurs. Veuillez les corriger avant de soumettre.';
    }
  }
  

  // Gérer la sélection des classes
  onClassSelection(event: any): void {
    const selectedClasses = event.value;
    console.log('Classes sélectionnées : ', selectedClasses);
  }
}
