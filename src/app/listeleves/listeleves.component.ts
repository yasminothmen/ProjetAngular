import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { StudentEditModalComponent } from '../student-edit-modal/student-edit-modal.component';

@Component({
  selector: 'app-liste-eleves',
  templateUrl: './listeleves.component.html',
  styleUrls: ['./listeleves.component.scss']
})
export class ListelevesComponent implements OnInit {
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'Action'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userservice: UserService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEleves() {
    this.userservice.getStudents().subscribe((data: User[]) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.loadEleves();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.firstname.toLowerCase().includes(filterText) || 
             data.lastname.toLowerCase().includes(filterText);
    };
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editStudent(student: User) {
    const dialogRef = this.dialog.open(StudentEditModalComponent, {
      width: '600px',
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userservice.updateUser(result.id, result).subscribe({
          next: () => {
            Swal.fire('Succès', 'L\'élève a été modifié avec succès', 'success');
            this.loadEleves();
          },
          error: (error) => {
            Swal.fire('Erreur', 'Une erreur s\'est produite lors de la modification', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  deleteStudent(id: string): void {
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
            Swal.fire('Supprimé!', 'L\'élève a été supprimé.', 'success');
            this.loadEleves();
          },
          error: (error) => {
            Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la suppression', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}