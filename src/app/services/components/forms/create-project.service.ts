import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {MatTab} from "@angular/material/tabs";

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  private indexTab = new BehaviorSubject<MatTab | null>(null);
  currentIndexTab = this.indexTab.asObservable();

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  addPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects`, post);
  }
  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }
}
