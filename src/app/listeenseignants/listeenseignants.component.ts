import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { Teacher } from '../models/teacher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TeacherEditModalComponent } from '../teacher-edit-modal/teacher-edit-modal.component';  // Modal Component

@Component({
  selector: 'app-listeenseignants',
  templateUrl: './listeenseignants.component.html',
  styleUrls: ['./listeenseignants.component.scss']
})
export class ListeenseignantsComponent implements OnInit {
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'matieresEnseignees', 'Action'];
  dataSource = new MatTableDataSource<Teacher>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userservice: UserService,
    private dialog: MatDialog  // MatDialog for modal handling
  ) {}

  ngOnInit() {
    this.loadEnseignants();

    // Custom filter for firstname and lastname
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.firstname.toLowerCase().includes(filterText) ||
             data.lastname.toLowerCase().includes(filterText);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    const dialogRef = this.dialog.open(TeacherEditModalComponent, {
      width: '400px',
      data: { teacher } 
    });

    dialogRef.afterClosed().subscribe((updatedTeacher: Teacher) => {
      if (updatedTeacher) {
        this.userservice.updateUser(updatedTeacher.id, updatedTeacher).subscribe({
          next: () => {
            Swal.fire('Modifié!', 'Les informations de l\'enseignant ont été mises à jour.', 'success');
            this.loadEnseignants();  // Reload the teacher list
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
            console.error(error);
          }
        });
      }
    });
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
            this.loadEnseignants();  // Reload the teacher list
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la suppression.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}
