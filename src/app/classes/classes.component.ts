import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Class} from "../models/class";
import {User} from "../models/user";
import {ClassesService} from "../services/classes.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent  implements OnInit{

  classForm: FormGroup;
  classe: Class = new Class();
  message: string = '';
  error: string = '';
  users: User[] = []; // List of users
  selectedUsers: string[] = []; // Store selected user IDs

  constructor(
    private fb: FormBuilder,
    private classService: ClassesService,
    private userService: UserService,
    private router: Router
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      studentsCount: [0], // Read-only, auto-updated
      selectedUsers: [[], Validators.required] // Store selected user IDs
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onUserSelection(event: any): void {
    // Extract the selected user IDs from the event
    this.selectedUsers = event.source.selected ?
      event.source.selected.map((option: any) => option.value) : [];

    // Update the 'selectedUsers' form control with the selected user IDs
    this.classForm.patchValue({
      selectedUsers: this.selectedUsers,
      studentsCount: this.selectedUsers.length // Automatically update students count
    });
  }

  onSubmit(): void {
    console.log("📌 Bouton Ajouter cliqué !");

    if (this.classForm.valid) {
      this.classe = this.classForm.value;
      this.classe.students = this.users.filter(user => this.selectedUsers.includes(user.id));

      // Check the students array before submitting
      console.log('Selected Students:', this.classe.students);
      console.log(this.classe);

      this.classService.createClass(this.classe).subscribe({
        next: () => {
          this.error = '';
          this.message = 'Classe ajoutée avec succès';
          Swal.fire({
            icon: 'success',
            title: 'Ajout',
            text: 'Classe ajoutée avec succès',
          });

          setTimeout(() => {
            this.router.navigate(['acceuil/classeslist']);
          }, 1000);
        },
        error: (error) => {
          this.error = error.status === 400 ? error.error : 'Erreur lors de l\'ajout de la classe';
          console.error(error);
        }
      });
    }
  }
}
