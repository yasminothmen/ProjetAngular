import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from '../services/emploie.service';
import { Schedule, Session } from '../models/emploie';
import html2pdf from 'html2pdf.js';
import { Location } from '@angular/common'; // Import ajouté pour le bouton retour

@Component({
  selector: 'app-emploie-affichage',
  templateUrl: './affiche-emploi.component.html',
  styleUrls: ['./affiche-emploi.component.scss']
})
export class EmploiAffichageComponent implements OnInit {

  sessions: Session[] = [];
  days: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  hours: string[] = [];
  timetable: { [hour: string]: { [day: string]: Session | null } } = {};
  displayedColumns: string[] = ["hour", ...this.days];

  selectedClass: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  subjectColors: { [subject: string]: string } = {};
  classefound = false;

  predefinedColors: string[] = [
    "#FF5733", "#33FF57", "#3357FF", "#F2C300", "#FF8C00", "#8A2BE2", "#FF1493", "#20B2AA", "#FFD700", "#ADFF2F",
    "#F08080", "#C71585", "#4682B4", "#7FFF00", "#D2691E", "#DC143C", "#B0C4DE", "#FF6347", "#98FB98", "#FFFACD",
    "#FF4500", "#32CD32", "#1E90FF", "#FF6347", "#8B4513", "#C0C0C0", "#800080", "#808000", "#008080", "#FF00FF",
    "#6A5ACD", "#FF1493", "#F0E68C", "#D3D3D3", "#B22222", "#5F9EA0", "#7CFC00", "#0000FF", "#FFD700", "#4B0082",
    "#FF7F50", "#8B008B", "#00FA9A", "#228B22", "#B8860B", "#A52A2A", "#800000", "#BC8F8F", "#FF6A6A", "#3CB371"
  ];
  pdfStorageService: any;

  constructor(
    private scheduleService: ScheduleService, 
    private cdr: ChangeDetectorRef,
    private location: Location // Injection du service Location
  ) {}

  ngOnInit(): void {}

  // Méthode pour le bouton retour
  goBack(): void {
    this.location.back();
  }

  fetchSchedule(): void {
    if (!this.selectedClass.trim()) {
      this.errorMessage = 'Veuillez entrer une classe valide.';
      this.classefound = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.sessions = [];

    this.scheduleService.getScheduleForClass(this.selectedClass).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          console.log("data: ", data)
          this.sessions = data.flatMap(schedule => schedule.sessions || []);
        }
        console.log("sessions", this.sessions)
        if (this.sessions.length === 0) {
          this.classefound = false;
        } else {
          this.classefound = true;
        }
        console.log(this.classefound)

        this.hours = [...new Set(this.sessions.map(session => session.time))].sort((a, b) => this.compareTimes(a, b));

        this.timetable = {};
        this.hours.forEach(hour => {
          this.timetable[hour] = {};
          this.days.forEach(day => {
            this.timetable[hour][day] = null;
          });
        });

        this.sessions.forEach(session => {
          if (this.timetable[session.time] && this.timetable[session.time][session.day] !== undefined) {
            this.timetable[session.time][session.day] = session;
          }
          this.assignSubjectColor(session.subject);
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'emploi du temps.';
        this.loading = false;
        this.classefound = false;
      }
    );
  }

  compareTimes(a: string, b: string): number {
    const [aStart, aEnd] = a.split('-').map(time => this.convertTo24Hour(time));
    const [bStart, bEnd] = b.split('-').map(time => this.convertTo24Hour(time));
    return aStart - bStart;
  }

  convertTo24Hour(time: string): number {
    const regex = /(\d+)(am|pm)/;
    const match = time.match(regex);

    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    if (match[2] === 'pm' && hours !== 12) {
      hours += 12;
    } else if (match[2] === 'am' && hours === 12) {
      hours = 0;
    }
    return hours;
  }

  assignSubjectColor(subject: string): void {
    if (!this.subjectColors[subject]) {
      const color = this.getUniqueColor(subject);
      this.subjectColors[subject] = color;
    }
  }

  getUniqueColor(subject: string): string {
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.predefinedColors.length;
    return this.predefinedColors[index];
  }

  // Modifiez la méthode downloadPDF() dans affiche-emploi.component.ts
async downloadPDF(): Promise<void> {
  const element = document.getElementById('timetable-table');
  const fileName = `Emploi_${this.selectedClass}_${new Date().toISOString().slice(0,10)}.pdf`;
  
  const options = {
    margin: 10,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (element) {
    await html2pdf().from(element).set(options).save();
    
    // Enregistrer l'URL dans la base de données
    this.pdfStorageService.savePdfInfo(
      fileName,
      'class',
      this.selectedClass
    ).subscribe({
      next: (response) => {
        console.log('PDF info saved:', response);
      },
      error: (err) => {
        console.error('Error saving PDF info:', err);
      }
    });
  }
}
}