import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/emploie';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/schedules'; // Update if needed

  constructor(private http: HttpClient) { }

  // Créer un emploi du temps
  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule);
  }

  // Récupérer l'emploi du temps pour une classe spécifique
  getScheduleForClass(className: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/${className}`);
  }

  // Récupérer l'emploi du temps pour un niveau spécifique
  getScheduleByLevel(level: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/level/${level}`);
  }

  // Mettre à jour un emploi du temps existant
  updateSchedule(id: string, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl}/update/${id}`, schedule);
  }

  // Supprimer un emploi du temps
  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  getScheduleForTeacher(teacherName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teacher/${encodeURIComponent(teacherName)}`);
  }

  

}
