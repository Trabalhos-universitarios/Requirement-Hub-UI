import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CreateProjectService} from "../../services/components/forms/create-project.service";
import {AlertService} from "../../services/shared/sweetalert/alert.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

    formGroup?: FormGroup | null;

    constructor(
        private createProjectService: CreateProjectService,
        private alertService: AlertService,
        private dialog: MatDialog) {
    }


    ngOnInit() {
        this.createProjectService.currentForm.subscribe(form => {
            this.formGroup = form;
        });
    }

    getData() {

        this.createProjectService.getPosts().subscribe(posts => {
            console.log("GET POSTS", posts);
            //this.alertService.toErrorAlert("ERRO!", "O projeto já existe!");
            //AQUI TERÁ A LÓGICA PARA TRATAR SE O PROJETO JÁ EXISTIR NO BACK END
        })
    }

    async saveData() {

        this.getData()

        if (this.formGroup && this.formGroup.valid) {

            this.createProjectService.addPost(this.formGroup.value).subscribe(resp => {
                console.log("RESP: ", resp.message)

                if (resp) {
                    this.alertService.toSuccessAlert("Projeto Salvo com sucesso!");
                    this.dialog.closeAll();
                    console.log("RESP: ", resp.message);
                    //window.location.reload();
                } else {
                    //this.alertService.toErrorAlert("ERRO!", "O projeto já existe!");
                }
            })
        }
    }
}

