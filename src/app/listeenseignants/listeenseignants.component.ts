import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { Teacher } from '../models/teacher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TeacherEditModalComponent } from '../teacher-edit-modal/teacher-edit-modal.component';
import { MatiereService } from '../services/matiere.service';
import { Matiere } from '../models/matiere';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listeenseignants',
  templateUrl: './listeenseignants.component.html',
  styleUrls: ['./listeenseignants.component.scss']
})
export class ListeenseignantsComponent implements OnInit {
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'matieresEnseignees', 'Action'];
  dataSource = new MatTableDataSource<Teacher>();
  allMatieres: Matiere[] = [];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userservice: UserService,
    private matiereService: MatiereService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
    
    this.dataSource.filterPredicate = (data: Teacher, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.firstname.toLowerCase().includes(filterText) ||
             data.lastname.toLowerCase().includes(filterText) ||
             data.email.toLowerCase().includes(filterText);
    };
  }

  loadData() {
    this.isLoading = true;
    
    forkJoin([
      this.matiereService.getAllSubjects(),
      this.userservice.getTeachers()
    ]).subscribe({
      next: ([matieres, teachers]) => {
        this.allMatieres = matieres;
        this.dataSource.data = teachers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMatieres(matiereIds: string[]): string {
    if (this.isLoading) return 'Chargement...';
    if (!matiereIds || matiereIds.length === 0) return 'Aucune matière';
    if (!this.allMatieres || this.allMatieres.length === 0) return 'Matières non disponibles';
    
    const matieresFound = this.allMatieres.filter(m => m && m.id && matiereIds.includes(m.id));
    
    if (matieresFound.length === 0) return 'Matières non trouvées';
    
    return matieresFound.map(m => m.name).join(', ');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTeacher(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherEditModalComponent, {
      width: '600px',
      data: { 
        teacher,
        allMatieres: this.allMatieres 
      }
    });

    dialogRef.afterClosed().subscribe((updatedTeacher: Teacher) => {
      if (updatedTeacher) {
        this.userservice.updateUser(updatedTeacher.id, updatedTeacher).subscribe({
          next: () => {
            Swal.fire('Modifié!', 'Les informations ont été mises à jour.', 'success');
            this.loadData();
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Échec de la mise à jour.', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  deleteTeacher(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: "Voulez-vous vraiment supprimer cet enseignant?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'L\'enseignant a été supprimé.', 'success');
            this.loadData();
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Échec de la suppression.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}