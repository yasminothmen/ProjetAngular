import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Class} from "../models/class";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = 'http://localhost:8080/api/classes'; // Update if needed

  constructor(private http: HttpClient) {}
  //créer une nouvelle classe
  createClass(classData:Class){
    return this.http.post<Class>(this.apiUrl,classData);
  }
  //Récupérer toutes les classes
  getAllClasses(){
    return this.http.get<Class[]>(this.apiUrl);
  }
  deleteClass(id:string){
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
  getClassById(id : string){
    return this.http.get<Class>(`${this.apiUrl}/${id}`)
  }
}
