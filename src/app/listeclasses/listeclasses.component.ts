import {Component, OnInit} from '@angular/core';
import {Class} from "../models/class";
import {ClassesService} from "../services/classes.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-listeclasses',
  templateUrl: './listeclasses.component.html',
  styleUrls: ['./listeclasses.component.scss']
})
export class ListeclassesComponent implements  OnInit{

  classes: Class[] = [];

  constructor(
    private classService: ClassesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  onDelete(classId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService.deleteClass(classId).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé!',
              'La classe a été supprimée.',
              'success'
            );
            this.loadClasses();  // Reload classes after deletion
          },
          error: (error) => {
            Swal.fire(
              'Erreur!',
              'Une erreur s\'est produite lors de la suppression de la classe.',
              'error'
            );
            console.error(error);
          }
        });
      }
    });
  }

  onViewDetails(classId: string): void {
    this.router.navigate([`/acceuil/classe/${classId}`]); // Navigate to class details page
  }
}
