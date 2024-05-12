import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  // Buscar posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts`);
  }

  // Adicionar post
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, post);
  }

}
