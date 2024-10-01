import {HttpClient, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, firstValueFrom, Observable, throwError} from 'rxjs';
import {environmentLocal} from 'src/environment/environment-local';
import {
    CommentsReactionsModel,
    CreateCommentsMessagesResponseModel,
    SearchCommentsMessagesModel
} from "../../models/comments-model";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private baseUrl = environmentLocal.springUrl + '/comments';

    constructor(private http: HttpClient) {
    }

    async addComment(comment: any): Promise<CreateCommentsMessagesResponseModel> {
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}`, comment).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async addReaction(id: number, reaction: CommentsReactionsModel): Promise<any> {
        return firstValueFrom(
            this.http.patch<any>(`${this.baseUrl}/${id}`, reaction).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }

    async getCommentsByRequirement(requirementId: number | undefined): Promise<SearchCommentsMessagesModel[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/${requirementId}`));
    }

    async deleteCommentById(id: number): Promise<HttpErrorResponse> {
        return firstValueFrom(
            this.http.delete<HttpErrorResponse>(`${this.baseUrl}/${id}`).pipe(
                catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
                        case 409:
                            return throwError(() => HttpStatusCode.Conflict);
                        case 404:
                            return throwError(() => HttpStatusCode.NotFound);
                        case 405:
                            return throwError(() => HttpStatusCode.MethodNotAllowed);
                        case 500:
                            return throwError(() => HttpStatusCode.InternalServerError);
                        case 503:
                            return throwError(() => HttpStatusCode.ServiceUnavailable);
                        default:
                            return throwError(() => new Error(error.message));
                    }
                })
            )
        );
    }
}
