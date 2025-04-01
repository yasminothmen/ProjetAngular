import { Component, OnInit } from '@angular/core';
import { Matiere } from "../models/matiere";  // Assure-toi d'avoir un modèle Matiere
import { MatiereService } from "../services/matiere.service";  // Assure-toi d'avoir un service pour les matières
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listematieres',
  templateUrl: './listematieres.component.html',
  styleUrls: ['./listematieres.component.scss']
})
export class ListematieresComponent implements OnInit {

  matieres: Matiere[] = [];  // Tableau des matières

  constructor(
    private matiereService: MatiereService,  // Service pour les matières
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMatieres();  // Charger les matières au démarrage du composant
  }

  // Charger toutes les matières via le service
  loadMatieres(): void {
    this.matiereService.getAllSubjects().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matières:', error);
      }
    });
  }

  // Supprimer une matière
  onDelete(matiereId: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.matiereService.deleteSubject(matiereId).subscribe({
          next: () => {
            Swal.fire(
              'Supprimée!',
              'La matière a été supprimée.',
              'success'
            );
            this.loadMatieres();  // Recharger la liste des matières après suppression
          },
          error: (error) => {
            Swal.fire(
              'Erreur!',
              'Une erreur s\'est produite lors de la suppression de la matière.',
              'error'
            );
            console.error(error);
          }
        });
      }
    });
  }

  // Voir les détails d'une matière
  onViewDetails(matiereId: string): void {
    this.router.navigate([`/acceuil/matieres/${matiereId}`]);  // Naviguer vers la page de détails de la matière
  }
}
