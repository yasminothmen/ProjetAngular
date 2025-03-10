import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
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

  // Ajouter un utilisateur
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Supprimer un utilisateur par ID
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une liste d'utilisateurs
  addListUsers(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/List`, users);
  }

  // Ajouter un utilisateur avec vérification du mot de passe
  // addUserWithPasswordCheck(user: User): Observable<string> {
  //   return this.http.post<string>(`${this.apiUrl}/with-password-check`, user);
  // }

  // Ajouter un utilisateur avec vérification du nom d'utilisateur
  // addUserWithUsernameCheck(user: User): Observable<string> {
  //   return this.http.post<string>(`${this.apiUrl}/with-username-check`, user);
  // }

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
