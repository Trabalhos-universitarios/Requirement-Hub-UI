import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CreateProjectService} from "../../services/components/forms/create-project.service";

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

    formGroup?: FormGroup | null;

    constructor(private createProjectService: CreateProjectService) {
    }


    ngOnInit() {
        this.createProjectService.currentForm.subscribe(form => {
            this.formGroup = form;
        });
    }

    saveData() {
        if (this.formGroup && this.formGroup.valid) {
            console.log('Dados do Formulário:', this.formGroup.value);

            this.createProjectService.addPost(this.formGroup.value).subscribe(resp => {
                if (resp) {
                    console.log("RESPOSTA: ", resp)
                }
            })
        }
    }
}

