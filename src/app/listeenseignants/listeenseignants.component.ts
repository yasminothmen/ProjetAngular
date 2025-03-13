import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { Teacher } from '../models/teacher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listeenseignants',
  templateUrl: './listeenseignants.component.html',
  styleUrls: ['./listeenseignants.component.scss']
})
export class ListeenseignantsComponent implements OnInit {
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'matieresEnseignees', 'Action'];
  dataSource = new MatTableDataSource<Teacher>();
  editingTeacher: Teacher | null = null; // L'enseignant actuellement en cours de modification
  editTeacherForm: FormGroup; // Formulaire pour modifier l'enseignant

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userservice: UserService, private fb: FormBuilder) {
    this.editTeacherForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matieresEnseignees: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.loadEnseignants();

    // Personnalisation du filtrage : filtrer uniquement sur le prénom et le nom
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.firstname.toLowerCase().includes(filterText) || 
             data.lastname.toLowerCase().includes(filterText);
    };
  }

  loadEnseignants(): void {
    this.userservice.getTeachers().subscribe((data: Teacher[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMatieres(matieresEnseignees: string[]): string {
    return matieresEnseignees.join(', ');
  }

  editTeacher(teacher: Teacher): void {
    this.editingTeacher = teacher; // L'enseignant sélectionné pour modification
    this.editTeacherForm.setValue({
      firstname: teacher.firstname,
      lastname: teacher.lastname,
      email: teacher.email,
      matieresEnseignees: teacher.matieresEnseignees.join(', ') // Convertir les matières en chaîne
    });
  }

  cancelEdit(): void {
    this.editingTeacher = null; // Annuler l'édition
  }

  onSubmit(): void {
    if (this.editTeacherForm.valid && this.editingTeacher) {
      const updatedTeacher = { 
        ...this.editingTeacher,
        ...this.editTeacherForm.value,
        matieresEnseignees: this.editTeacherForm.value.matieresEnseignees.split(',').map((matiere: string) => matiere.trim()) // Reconvertir les matières en tableau
      };
      this.userservice.updateUser(updatedTeacher.id, updatedTeacher).subscribe({
        next: () => {
          Swal.fire('Modifié!', 'Les informations de l\'enseignant ont été mises à jour.', 'success');
          this.loadEnseignants(); // Rafraîchir la liste
          this.cancelEdit(); // Annuler l'édition
        },
        error: (error) => {
          Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
          console.error(error);
        }
      });
    }
  }

  deleteTeacher(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'L\'enseignant a été supprimé.', 'success');
            this.loadEnseignants();
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la suppression de l\'enseignant.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}
