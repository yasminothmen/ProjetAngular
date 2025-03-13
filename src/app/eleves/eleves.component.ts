import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    private router: Router
  ) 
  
  { 
    this.eleveForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: [''], // Ajout d'une valeur vide
      username: [''], // Ajout d'une valeur vide
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

  onSubmit(): void {
    console.log("📌 Bouton Ajouter cliqué !");
    if (this.eleveForm.valid) {
      this.eleve = this.eleveForm.value;
      //******************** */
      console.log("Données envoyées :", this.eleve);
      // Appel au service pour ajouter un utilisateur
      this.userService.addStudent(this.eleve).subscribe({
        next: () => {
          this.message = 'L\'élève a été ajouté avec succès !';
          this.error = '';
           Swal.fire({
                      icon: 'success',
                      title: 'Ajout',
                      text: 'Elève ajoutée avec succès',
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
    } 
  }
}
