import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStats } from '../models/dashboard';
import { Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
    totalSchedules: 0,
    activeTeachers: 0, 
    activeClasses: 0,  
  };
  isLoading = true;
  errorMessage: string | null = null;
  private statsSubscription!: Subscription;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.statsSubscription = this.dashboardService.getDashboardStats()
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des statistiques', error);
          this.errorMessage = 'Impossible de charger les données. Veuillez réessayer plus tard.';
          throw error; // Vous pourriez aussi retourner un observable par défaut ici
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: DashboardStats) => {
          this.stats = {
            ...this.stats, // Garde les valeurs par défaut si certaines propriétés sont manquantes
            ...data
          };
        }
      );
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  // Optionnel: Méthode pour rafraîchir les données
  refreshStats(): void {
    this.loadStats();
  }
}