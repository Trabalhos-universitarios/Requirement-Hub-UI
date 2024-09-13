import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentLocal } from 'src/environment/environment-local';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private baseUrl = environmentLocal.springUrl + '/comments';

    constructor(private http: HttpClient) {}

    addComment(comment: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}`, comment);
    }

    getCommentsByRequirement(requirementId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${requirementId}`);
    }
}
