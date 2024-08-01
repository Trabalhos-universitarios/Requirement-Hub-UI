import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTraceabilityMatrix(): Observable<[]> {
    return this.http.get<[]>(`${this.baseUrl}/matriz_de_rastreabilidade_array`);
  }
}
