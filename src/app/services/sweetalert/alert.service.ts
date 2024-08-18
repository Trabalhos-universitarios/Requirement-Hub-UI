import {Injectable} from '@angular/core';
import Swal, {SweetAlertResult} from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    async toSuccessAlert(title: string) {
        return await Swal.fire({
            position: "center",
            icon: "success",
            title: title,
            showConfirmButton: false,
            timer: 1000,
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

    async toInfoAlert(title: string, message: string) {
        return await Swal.fire({
            icon: "warning",
            title: title,
            text: message,
            backdrop: false
        });
    }

    async toOptionalActionAlert(title: string, text: string): Promise<SweetAlertResult> {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            confirmButtonColor: "#437222",
            cancelButtonColor: "#d33",
            showCancelButton: true,
            confirmButtonText: "Sim, deletar!"
        });

        if (result.isConfirmed) {
            await this.toSuccessAlert("Deletado com sucesso!");
        } else if (result.isDenied) {
            await this.toInfoAlert("Operação cancelada!", "");
        }

        return result;
    }

    async toOptionalWith3Buttons(title: string, confirmButton: string, actionFromYesButton: any): Promise<SweetAlertResult> {
        let resultReturn: SweetAlertResult = {} as SweetAlertResult;
        await Swal.fire({
            title: title,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: confirmButton,
            denyButtonText: actionFromYesButton
        }).then((result) => {
            resultReturn = result;
            if (result.isConfirmed) {
                this.toSuccessAlert("Deletado com sucesso!");
            } else if (result.isDenied) {
                this.toInfoAlert("Operação cancelada!", "");
            }
        });
        return resultReturn;
    }
}
