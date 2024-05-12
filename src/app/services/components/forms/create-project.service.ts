import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  // Buscar posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  // Adicionar post
  addPost(post: any): Observable<any> {
    console.log("DADOS INDO PARA O BANCO: ", post)
    return this.http.post(`${this.baseUrl}/projects`, post);
  }
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }
}
