import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  async toSuccessAlert(title: string) {
    return await Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 2500,
      backdrop: false
    });
  }

  async toErrorAlert(title: string, message: string) {
    return await Swal.fire({
      icon: "error",
      title: title,
      text: message,
      backdrop: false
    });
  }
}
