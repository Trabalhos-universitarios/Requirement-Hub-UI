import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {ProjectsTableService} from 'src/app/services/projects/projects-table.service';
import {LocalStorageService} from "../../../../services/localstorage/local-storage.service";
import {CapitalizeFirstPipePipe} from "../../../../pipes/capitalize-first-pipe.pipe";
import {StakeholdersService} from "../../../../services/stakeholders/stakeholders.service";
import {StakeholdersModel} from "../../../../models/stakeholders-model";
import {UsersService} from "../../../../services/users/users.service";
import {UserResponseModel} from "../../../../models/user-model";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {RichTextService} from "../../../../services/richText/rich-text.service";
import {SelectionModel} from "@angular/cdk/collections";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-create-requirement-form',
    templateUrl: './create-requirement-form.component.html',
    styleUrls: ['./create-requirement-form.component.scss']
})
export class CreateRequirementFormComponent implements OnInit {

    @Input() inputRequirementDataWithUpdateRequirement: RequirementsDataModel | undefined;
    public formGroup: FormGroup = this.formBuilder.group({
        projectRelated: new FormControl({value: "", disabled: true}),
        version: new FormControl({value: "", disabled: true}),
        author: new FormControl({value: "", disabled: true}),
        identifier: new FormControl({value: "", disabled: true}), // ESSE CAMPO DEVERÁ APARECER NA TELA DE EDITAR REQUISITO
        name: new FormControl('', Validators.required),
        stakeholders: new FormControl('', Validators.required),
        risk: new FormControl('', Validators.required),
        priority: new FormControl('', Validators.required),
        responsible: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        effort: new FormControl(''),
        dependencies: new FormControl(''),
        description: new FormControl(''),
    })
    private valuesFormToEdit: string[] = ['projectRelated', 'version', 'author', 'identifier', 'name', 'stakeholders', 'type']
    public fontList: StakeholdersModel[] | undefined;
    public responsibleList: UserResponseModel[] | undefined;
    public requirementsDependencies: RequirementsDataModel[] | undefined;
    public riskList: string[] = ['Low', 'Medium', 'High'];
    public priorityList: string[] = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
    public typeList: string[] = ['Funcional', 'Não Funcional']
    public effortList: string[] = ['2', '3', '8', '13', '21', '34', '55'];

    private stakeholderList: StakeholdersModel[] = [];

    constructor(private formBuilder: FormBuilder,
                private requirementService: RequirementsService,
                private projectsTableService: ProjectsTableService,
                private localStorageService: LocalStorageService,
                private stakeholderService: StakeholdersService,
                private userService: UsersService,
                private capitalizeFirstPipe: CapitalizeFirstPipePipe,
                private richTextService: RichTextService) {}

    ngOnInit() {
        this.disableFormWithUpdateRequirement();
        this.getCurrentProject();
        this.createForm();
        this.getCurrentStakeholders().then()
        this.getRequirementAnalysts().then()
        this.getRequirements().then()
        this.autoCompleteForm();
    }

    disableFormWithUpdateRequirement() {
        for (let value of this.valuesFormToEdit) {
            if (this.inputRequirementDataWithUpdateRequirement) {
                this.formGroup.get(`${value}`)?.disable();
            }
        }
    }

    private createForm() {
        this.formGroup.valueChanges.subscribe(val => {
            this.requirementService.updateForm(this.formGroup);
        });
    }

    private autoCompleteForm() {

        console.log("this.inputRequirementDataWithUpdateRequirement", this.inputRequirementDataWithUpdateRequirement)

        this.stakeholderService.getStakeholdersObservable().subscribe(value => {
            value.filter(s => s.id == this.inputRequirementDataWithUpdateRequirement?.stakeholderIds)
                .map(ns => this.stakeholderList.push(ns))
        })

        //todo parei aqui, tentando pegar o valor do array e transformar no objeto
        for (let stakeholder of this.stakeholderList) {
            console.log("STAKEHOLDER", stakeholder)
        }
        //this.stakeholderList.forEach(s => console.log("STAKEHOLDER LIST", s))

        this.formGroup.patchValue({
                projectRelated: this.getCurrentProject(),
                author: this.inputRequirementDataWithUpdateRequirement?.author ? this.inputRequirementDataWithUpdateRequirement.author : this.getCurrentAuthor(),
                version: this.inputRequirementDataWithUpdateRequirement?.version ? this.inputRequirementDataWithUpdateRequirement.version : 1,
                identifier: this.inputRequirementDataWithUpdateRequirement?.identifier,
                name: this.inputRequirementDataWithUpdateRequirement?.name ? this.inputRequirementDataWithUpdateRequirement.name : '',
                stakeholders: this.inputRequirementDataWithUpdateRequirement?.stakeholderIds ? this.inputRequirementDataWithUpdateRequirement.stakeholderIds : '',
                risk: this.inputRequirementDataWithUpdateRequirement?.risk ? this.inputRequirementDataWithUpdateRequirement.risk : '',
                priority: this.inputRequirementDataWithUpdateRequirement?.priority ? this.inputRequirementDataWithUpdateRequirement.priority : '',
                responsible: this.inputRequirementDataWithUpdateRequirement?.responsibleIds ? this.inputRequirementDataWithUpdateRequirement.responsibleIds : '',
                type: this.inputRequirementDataWithUpdateRequirement?.type ? this.inputRequirementDataWithUpdateRequirement.type : '',
                effort: this.inputRequirementDataWithUpdateRequirement?.effort ? this.inputRequirementDataWithUpdateRequirement.effort.toString() : '',
                dependencies: this.inputRequirementDataWithUpdateRequirement ? this.requirementsDependencies : '', //todo teste
                description: this.inputRequirementDataWithUpdateRequirement?.description ? this.inputRequirementDataWithUpdateRequirement.description : '',
            }
        );
    }

    private async getCurrentStakeholders() {
        this.stakeholderService.getStakeholders().then(stakeholders => {

            console.log("STAKEHOLDERS", stakeholders)

            this.fontList = stakeholders
        })
    }

    private async getRequirementAnalysts() {
        this.userService.getRequirementAnalysts().then(analysts => {

            console.log("ANALYSTS", analysts)

            this.responsibleList = analysts
        })
    }

    private async getRequirements() {
        this.requirementService.getRequirementsByProjectRelated(this.projectsTableService.getCurrentProjectById()).then(requirements => {

            console.log("REQUIREMENTS", requirements)

            requirements.sort((a, b) => a.identifier.localeCompare(b.identifier));
            this.requirementsDependencies = requirements;
        })
    }

    private getCurrentProject() {
        return this.projectsTableService.getCurrentProjectByName();
    }

    protected getCurrentAuthor() {
        const author = this.localStorageService.getItem('name');
        return this.capitalizeFirstPipe.transform(author);
    }
}
