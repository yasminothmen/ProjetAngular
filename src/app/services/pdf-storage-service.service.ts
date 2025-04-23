import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfStorageServiceService {
  private apiUrl = 'http://localhost:8080/api/pdf-storage';
  constructor(private http: HttpClient) { }

  savePdfInfo(fileName: string, entityType: 'teacher' | 'class', entityName: string): Observable<any> {
    return this.http.post(this.apiUrl, null, {
      params: {
        fileName,
        entityType,
        entityName
      }
    });
  }
  getPdfsForEntity(entityType: 'teacher' | 'class', entityName: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      params: {
        entityType,
        entityName
      }
    });
  }


}
