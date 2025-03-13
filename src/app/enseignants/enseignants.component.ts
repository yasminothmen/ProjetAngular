import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatiereService } from '../services/matiere.service';  // Assurez-vous d'importer ce service
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-enseignants',
  templateUrl: './enseignants.component.html',
  styleUrls: ['./enseignants.component.scss']
})
export class EnseignantsComponent implements OnInit {
isMultiple: BooleanInput;
toggleMultiple($event: MatCheckboxChange) {
throw new Error('Method not implemented.');
}
  enseignantForm: FormGroup;
  matieres: any[] = []; // Liste des matières
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private matiereService: MatiereService, // Injection correcte du service MatiereService
    private router: Router
  ) {
    this.enseignantForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matieresEnseignees: [[], Validators.required], // Correction du nom pour correspondre au formulaire
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Récupérer les matières disponibles depuis le service
    this.matiereService.getAllSubjects().subscribe(
      (data: any[]) => {
        this.matieres = data;
      },
      (err: any) => { // Spécifier le type 'any' pour l'erreur
        console.error('Erreur lors de la récupération des matières', err);
        this.error = 'Erreur lors de la récupération des matières';
      }
    );
  }

  // Implémentation de la méthode onSubmit
  onSubmit() {
    if (this.enseignantForm.valid) {
      const formData = this.enseignantForm.value;
      // Envoyer les données à votre service pour l'ajout de l'enseignant
      this.userService.addTeacher(formData).subscribe(
        (response) => {
          this.message = 'Enseignant ajouté avec succès !';
          Swal.fire({
                      icon: 'success',
                      title: 'Ajout',
                      text: 'Enseignant ajoutée avec succès',
                    });
          this.router.navigate(['acceuil/listeenseignants']); // Rediriger vers la liste des enseignants
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'enseignant', error);
          this.error = 'Erreur lors de l\'ajout de l\'enseignant';
        }
      );
    } else {
      this.error = 'Veuillez remplir tous les champs requis';
    }
  }

  // Implémentation de la méthode onSubjectSelection
  onSubjectSelection(event: MatSelectChange) {
    const selectedMatieres = event.value; // Récupérer les matières sélectionnées
    console.log('Matières sélectionnées:', selectedMatieres);
    // Vous pouvez ajouter des logiques supplémentaires si nécessaire
  }
}
