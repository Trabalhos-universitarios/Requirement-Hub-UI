import {AlertService} from "../services/sweetalert/alert.service";

export async function isExceptionType(alertService: AlertService, error: any, messageConflict: string, action?: string) {

    if (action === "alert") {
        switch (error) {
            case 409:
                console.error(`CONFLICT: ${error}`);
                await alertService.toErrorAlert("Erro!", messageConflict);
                break;
            case 404:
                console.error(`NOT FOUND: ${error}`);
                await alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                break;
            case 405:
                console.error(`METHOD NOT ALLOWED: ${error}`);
                await alertService.toErrorAlert("Erro!", "Rota não encontrada ou fora!");
                break;
            case 500:
                console.error(`INTERNAL SERVER ERROR: ${error}`);
                await alertService.toErrorAlert("Erro!", "Erro interno do servidor!");
                break;
            default:
                console.error(`ERROR: ${error}`);
                await alertService.toErrorAlert("Erro!", "Erro ao cadastrar requisito - " + error);
        }
    } else {
        return error;
    }
}