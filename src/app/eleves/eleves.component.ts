import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-eleves',
  templateUrl: './eleves.component.html',
  styleUrls: ['./eleves.component.scss']
})
export class ElevesComponent implements OnInit {

  eleveForm: FormGroup;
  eleve: User = new User();
  message: string = '';
  error: string = '';
  users: User[] = []; // List of users
  selectedUsers: string[] = []; // Store selected user IDs

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { 
    this.eleveForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [''],
      username: [''],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getStudents().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  async onSubmit(): Promise<void> {
    console.log("📌 Bouton Ajouter cliqué !");
    if (this.eleveForm.valid) {
      try {
        const formData = this.eleveForm.value;
        this.eleve = formData;

        // 1. Création du compte Firebase
        const firebaseUserCredential = await this.afAuth.createUserWithEmailAndPassword(
          formData.email, 
          formData.password
        );

        // Vérification que firebaseUser n'est pas null
        if (!firebaseUserCredential || !firebaseUserCredential.user) {
          throw new Error('La création du compte Firebase a échoué');
        }

        // 2. Ajout de l'UID Firebase et du rôle à l'objet élève
        this.eleve.firebaseUid = firebaseUserCredential.user.uid;
        this.eleve.role = 'student';

        // 3. Enregistrement dans MongoDB (avec le mot de passe comme avant)
        this.userService.addStudent(this.eleve).subscribe({
          next: () => {
            this.message = 'L\'élève a été ajouté avec succès !';
            this.error = '';
            Swal.fire({
              icon: 'success',
              title: 'Ajout',
              text: 'Elève ajouté avec succès',
            });
            setTimeout(() => {
              this.router.navigate(['acceuil/elevesList']);
            }, 1000);
          },
          error: (error) => {
            console.error("Erreur lors de l'ajout :", error);
            this.error = error.status === 400 ? error.error : 'Erreur lors de l\'ajout de l\'élève';
            console.error(error);
          }
        });

      } catch (firebaseError) {
        console.error("Erreur Firebase:", firebaseError);
        this.error = this.getFirebaseErrorMessage(firebaseError);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: this.error,
        });
      }
    } 
  }

  private getFirebaseErrorMessage(error: any): string {
    if (!error || !error.code) {
      return 'Une erreur inconnue est survenue';
    }

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
}