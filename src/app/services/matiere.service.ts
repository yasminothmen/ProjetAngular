import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Matiere } from '../models/matiere';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private apiUrl = 'http://localhost:8080/subjects'; // Update if needed

  constructor(private http: HttpClient) {}
  // Récupérer toutes les matières
  getAllSubjects() {
    return this.http.get<Matiere[]>(this.apiUrl);
  }

  // Récupérer une matière par son ID
  getSubjectById(id: string) {
    return this.http.get<Matiere>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle matière
  createSubject(subject: Matiere) {
    return this.http.post<Matiere>(this.apiUrl, subject);
  }

  // Mettre à jour une matière existante
  // updateSubject(id: string, subject: Matiere) {
  //   return this.http.put<Matiere>(`${this.apiUrl}/${id}`, subject);
  // }

  // Supprimer une matière par son ID
  deleteSubject(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
