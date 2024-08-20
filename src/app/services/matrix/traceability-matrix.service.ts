import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentLocal } from 'src/environment/environment-local';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  private baseUrl = 'http://localhost:3000';
  //private baseUrl = environmentLocal.springUrl

  constructor(private http: HttpClient) {}

  getTraceabilityMatrix(projectId: number): Observable<[]> {
    return this.http.get<[]>(`${this.baseUrl}/matrix_${projectId}`);
    //return this.http.get<[]>(`${this.baseUrl}/matrix/generate`);
  }
}
