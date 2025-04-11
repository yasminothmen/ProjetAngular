import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatiereService } from '../services/matiere.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BooleanInput } from '@angular/cdk/coercion';
import { AbstractControl, ValidatorFn } from '@angular/forms';


function emailDomainValidator(domain: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    if (email && !email.endsWith(`@${domain}`)) {
      return { 'invalidDomain': true };
    }
    return null;
  };
}
@Component({
  selector: 'app-enseignants',
  templateUrl: './enseignants.component.html',
  styleUrls: ['./enseignants.component.scss']
})
export class EnseignantsComponent implements OnInit {
  isMultiple: BooleanInput;
  enseignantForm: FormGroup;
  matieres: any[] = [];
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private matiereService: MatiereService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.enseignantForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, emailDomainValidator('enseignant.com')]],
      matieresEnseignees: [[], Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  

  ngOnInit(): void {
    this.loadMatieres();
  }

  private loadMatieres(): void {
    this.matiereService.getAllSubjects().subscribe(
      (data: any[]) => {
        this.matieres = data;
      },
      (err: any) => {
        console.error('Erreur lors de la récupération des matières', err);
        this.error = 'Erreur lors de la récupération des matières';
      }
    );
  }

  async onSubmit() {
    if (this.enseignantForm.valid) {
      try {
        const formData = this.enseignantForm.value;
        
        // Étape 1: Création du compte Firebase (mot de passe stocké ici)
        const firebaseUser = await this.createFirebaseAccount(formData.email, formData.password);
        
        // Étape 2: Préparation des données pour MongoDB (sans le mot de passe)
        const teacherData = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          matieresEnseignees: formData.matieresEnseignees,
          firebaseUid: firebaseUser.uid, // Lien avec le compte Firebase
          role: 'teacher'
          // Le mot de passe n'est pas inclus ici
        };

        // Étape 3: Enregistrement dans MongoDB
        await this.saveTeacherToMongoDB(teacherData);
        
        this.showSuccessAlert();
        this.redirectToTeacherList();
      } catch (error) {
        this.handleError(error);
      }
    } else {
      this.error = 'Veuillez remplir tous les champs requis';
    }
  }

  private async createFirebaseAccount(email: string, password: string): Promise<any> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (firebaseError) {
      console.error('Erreur Firebase:', firebaseError);
      throw new Error(this.getFirebaseErrorMessage(firebaseError));
    }
  }

  private saveTeacherToMongoDB(teacherData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.addTeacher(teacherData).subscribe(
        () => resolve(),
        (error) => reject(error)
      );
    });
  }

  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé';
      case 'auth/invalid-email':
        return 'Email invalide';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      default:
        return 'Erreur lors de la création du compte';
    }
  }

  private showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Enseignant créé avec succès',
    });
  }

  private redirectToTeacherList(): void {
    this.router.navigate(['acceuil/listeenseignants']);
  }

  private handleError(error: any): void {
    console.error('Erreur:', error);
    this.error = error.message || 'Une erreur est survenue';
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: this.error,
    });
  }

  onSubjectSelection(event: MatSelectChange): void {
    console.log('Matières sélectionnées:', event.value);
  }

  toggleMultiple($event: MatCheckboxChange): void {
    this.isMultiple = $event.checked;
  }
}