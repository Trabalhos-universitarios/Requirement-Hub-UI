import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {MatTab} from "@angular/material/tabs";
import {DataModel} from "../../../components/tables/projecs-table/utils/data-model";

@Injectable({
  providedIn: 'root'
})
export class CreateProjectFormService {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }
}
