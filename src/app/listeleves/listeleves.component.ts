import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import Swal from 'sweetalert2';

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

  constructor(private userservice: UserService) {}

  // ngOnInit() {
  //   this.loadEleves();
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEleves() {
    this.userservice.getAllUsers().subscribe((data: User[]) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.loadEleves();

    // Personnalisation du filtrage : filtrer uniquement sur le prénom et le nom
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
    console.log("Modifier l'élève :", student);
    // Ajouter la logique pour modifier l'élève
  }

  deleteStudent(id: string): void{
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result)=>{
      if (result.isConfirmed){
        this.userservice.deleteUser(id).subscribe({ 
          next:()=>{
            Swal.fire(
                          'Supprimé!',
                          'L\'élève a été supprimée.',
                          'success'
                        );
                        this.loadEleves(); // Rafraîchir la liste après suppression


          },
           error: (error) => {
                      Swal.fire(
                        'Erreur!',
                        'Une erreur s\'est produite lors de la suppression de la classe.',
                        'error'
                      );
                      console.error(error);




      },
    });
  }
  });
}}
