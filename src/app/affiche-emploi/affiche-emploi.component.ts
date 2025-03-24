import { Component, Input, OnInit } from '@angular/core';
import { ScheduleService } from '../services/emploie.service';
import { ClassesService } from '../services/classes.service';
import { MatiereService } from '../services/matiere.service';

@Component({
  selector: 'app-emploie-affichage',
  templateUrl: './affiche-emploi.component.html',
  styleUrls: ['./affiche-emploi.component.css']
})
export class EmploiAffichageComponent implements OnInit {
  @Input() scheduleData: any;
  days: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  timeSlots: string[] = ['8am-10am', '10am-12am', '1pm-3pm', '3pm-5pm'];
  colorMap: {[key: string]: string} = {};
  
  constructor(
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.generateColorMap();
  }

  generateColorMap(): void {
    this.matiereService.getAllSubjects().subscribe(matieres => {
      const colors = [
        '#FFD700', '#FF6347', '#7FFFD4', '#9370DB', 
        '#00FA9A', '#1E90FF', '#FF69B4', '#FFA07A',
        '#20B2AA', '#778899', '#7B68EE', '#32CD32'
      ];
      
      matieres.forEach((matiere, index) => {
        this.colorMap[matiere.name] = colors[index % colors.length];
      });
    });
  }

  getSession(day: string, time: string): any {
    if (!this.scheduleData || !this.scheduleData.sessions) return null;
    
    return this.scheduleData.sessions.find((session: any) => 
      session.day === day && session.time === time
    );
  }

  getSubjectColor(subject: string): string {
    return this.colorMap[subject] || '#FFFFFF';
  }
}