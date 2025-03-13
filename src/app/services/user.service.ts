import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Teacher } from '../models/teacher'; // Importer Teacher
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/user'; // API URL pour Spring Boot

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Récupérer les étudiants
  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/students`);
  }

  // Récupérer les enseignants
  getTeachers(): Observable<Teacher[]> {  // Retourner un tableau de Teacher
    return this.http.get<Teacher[]>(`${this.apiUrl}/teachers`);
  }

  // Ajouter un utilisateur
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Ajouter un étudiant
  addStudent(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add-student`, user);
  }

  // Ajouter un enseignant
  addTeacher(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add-teacher`, user);
  }

  // Supprimer un utilisateur par ID
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une liste d'utilisateurs
  addListUsers(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/List`, users);
  }

  // Mettre à jour un utilisateur par ID
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Récupérer un utilisateur par ID
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Récupérer un utilisateur par nom d'utilisateur
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }
}
