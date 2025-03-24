import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatiereService } from '../services/matiere.service';
import { ClassesService } from '../services/classes.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ScheduleService } from '../services/emploie.service';

@Component({
  selector: 'app-emploi',
  templateUrl: './emploi.component.html',
  styleUrls: ['./emploi.component.scss']
})
export class EmploiComponent implements OnInit {
  scheduleForm: FormGroup;
  classes: any[] = [];
  levels: string[] = [];
  teachers: any[] = [];
  matieres: any[] = [];
  timeOptions: string[] = ['8am-10am', '10am-12am', '1pm-3pm', '3pm-5pm'];
  days: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private scheduleService: ScheduleService,
    private classService: ClassesService,
    private userService: UserService,
    private router: Router
  ) {
    this.scheduleForm = this.fb.group({
      selectedClass: [null, Validators.required],
      level: ['', Validators.required],
      sessions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
    this.loadMatieres();
  }

  loadClasses(): void {
    this.classService.getAllClasses().subscribe(
      (data) => {
        this.classes = data;
        this.levels = [...new Set(data.map(c => c.level))];
      },
      (err) => console.error('Erreur classes:', err)
    );
  }

  loadTeachers(): void {
    this.userService.getTeachers().subscribe(
      (data) => this.teachers = data,
      (err) => console.error('Erreur enseignants:', err)
    );
  }

  loadMatieres(): void {
    this.matiereService.getAllSubjects().subscribe(
      (data) => this.matieres = data,
      (err) => console.error('Erreur matières:', err)
    );
  }

  get sessions(): FormArray {
    return this.scheduleForm.get('sessions') as FormArray;
  }

  createSchedule(): void {
    const sessionGroup = this.fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      teacher: ['', Validators.required],
      subject: ['', Validators.required]
    });
    this.sessions.push(sessionGroup);
  }

  removeSession(index: number): void {
    this.sessions.removeAt(index);
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const formData = {
        className: this.scheduleForm.value.selectedClass.name,
        level: this.scheduleForm.value.level,
        sessions: this.scheduleForm.value.sessions.map((session: any) => ({
          day: session.day,
          time: session.time,
          teacher: session.teacher,
          subject: session.subject
        }))
      };

      this.scheduleService.createSchedule(formData).subscribe({
        next: () => {
          Swal.fire('Succès!', 'Emploi enregistré', 'success');
          this.router.navigate(['/acceuil/afficheEmploie']);
        },
        error: (err) => {
          console.error('Erreur:', err);
          Swal.fire('Erreur', 'Enregistrement échoué', 'error');
        }
      });
    }
  }

  onClassSelection(event: any): void {
    const selectedClass = event.value;
    if (selectedClass) {
      this.scheduleForm.patchValue({
        level: selectedClass.level
      });
    }
  }
}