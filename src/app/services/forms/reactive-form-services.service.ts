import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ReactiveFormServices {

  private formGroupSource = new BehaviorSubject<FormGroup | null>(null);
  currentForm = this.formGroupSource.asObservable();

  updateForm(formGroup: FormGroup) {
    this.formGroupSource.next(formGroup);
  }
}
