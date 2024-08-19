import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, firstValueFrom, Observable, throwError} from "rxjs";
import {FormGroup} from "@angular/forms";
import {environmentLocal} from "../../../environment/environment-local";
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {ProjectDataModel} from "../../models/project-data-model";


@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
    private baseUrl = environmentLocal.springUrl
    public currentForm = this.formGroupSource.asObservable();

    constructor(private http: HttpClient) {}

    async getProjects(): Promise<ProjectDataModel[]> {
        return firstValueFrom(this.http.get<ProjectDataModel[]>(`${this.baseUrl}/project/all`));
    }


    async getProjectsByUserId(userId : number): Promise<ProjectDataModel[]> {
        return firstValueFrom(this.http.get<ProjectDataModel[]>(`${this.baseUrl}/project/all/${userId}`));
    }

    //SERVIÇOS DO FORMULÁRIO
    updateForm(formGroup: FormGroup) {
        this.formGroupSource.next(formGroup);
    }

    createProject(post: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/project`, post);

    createProject(post: any): Promise<any> {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/project`, post).pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 409) {
                        console.error('This project already exists!');
                        return throwError(() => HttpStatusCode.Conflict);
                    }
                    if (error.status === 404 || error.status === 405) {
                        console.error('This route not exists or not starting!');
                        return throwError(() => HttpStatusCode.NotFound);
                    } else if (error.status === 500 || error.status === 503) {
                        console.error('Internal server error!');
                        return throwError(() => HttpStatusCode.InternalServerError);
                    }
                    return throwError(() => new Error(error.message));
                })
            )
        );
    }

    deleteProject(id: number): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.baseUrl}/project/${id}`));
    }
}
