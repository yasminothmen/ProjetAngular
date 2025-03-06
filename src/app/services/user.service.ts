import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/user'; // Update if needed

  constructor(private http: HttpClient) {}
         getAllUsers(){
     return this.http.get<User[]>(this.apiUrl);
         }
}
