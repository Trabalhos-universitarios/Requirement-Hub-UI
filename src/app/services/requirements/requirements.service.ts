import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {RequirementsDataModel} from "../../models/requirements-data-model";
import {environmentLocal} from "../../../environment/environment-local";
import {ArtifactResponseModel} from 'src/app/models/artifact-response-model';

@Injectable({
    providedIn: 'root'
})
export class RequirementsService {

    private _currentForm = new BehaviorSubject<any>({});
    currentForm = this._currentForm.asObservable();
    _verificationsFormValid = new BehaviorSubject<any>({});
    verificationsFormValid = this._verificationsFormValid.asObservable();
    private baseUrl = environmentLocal.springUrl;

    constructor(private http: HttpClient) {}

    verifierFormValid(formValid: boolean) {
        this._verificationsFormValid.next(formValid);
    }

    updateForm(formValue: RequirementsDataModel | any) {
        this._currentForm.next(formValue);
    }

    async getRequirementDataToUpdate(requirementId: number | undefined): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/requirement-id/${requirementId}`))
    }

    async getRequirementsByProjectId(projectId: number): Promise<RequirementsDataModel[]> {
        return firstValueFrom(this.http.get<RequirementsDataModel[]>(`${this.baseUrl}/requirements/byproject/${projectId}`))
    }

    getRequirementByIdentifierAndProjectRelated(identifier: string, projectId: number): Observable<ArtifactResponseModel> {
        return this.http.get<ArtifactResponseModel>(`${this.baseUrl}/requirements/requirementByProjectRelated/${identifier}/${projectId}`);
    }

    getArtifactRequirementByIdentifierAndProjectRelated(identifier: string, projectId: number): Observable<RequirementsDataModel> {
        return this.http.get<RequirementsDataModel>(`${this.baseUrl}/requirements/artifactRequirementByProjectRelated/${identifier}/${projectId}`);
    }

    async createRequirements(post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/requirements`, post).pipe(
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

    async updateRequirements(id: number | undefined, post: any): Promise<RequirementsDataModel[] | any> {
        return firstValueFrom(this.http.put(`${this.baseUrl}/requirements/${id}`, post)
            .pipe(catchError((error: HttpErrorResponse) => {

                    switch (error.status) {
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

    async deleteRequirement(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/requirements/${id}`));
    }
}
