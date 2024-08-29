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
import {RequirementUtil} from "../../../../utils/requirement.util";

@Component({
    selector: 'app-create-requirement-form',
    templateUrl: './create-requirement-form.component.html',
    styleUrls: ['./create-requirement-form.component.scss']
})
export class CreateRequirementFormComponent implements OnInit {

    @Input() inputRequirementDataWithUpdateRequirement: RequirementsDataModel | undefined;
    protected formGroup: FormGroup = this.formBuilder.group({
        projectRelated: new FormControl({value: "", disabled: true}),
        version: new FormControl({value: "", disabled: true}),
        author: new FormControl({value: "", disabled: true}),
        identifier: new FormControl({value: "", disabled: true}),
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
    protected fontList: StakeholdersModel[] | undefined;
    protected responsibleList: UserResponseModel[] | undefined;
    protected requirementsDependencies: RequirementsDataModel[] | undefined;
    protected riskList: string[] = RequirementUtil.riskList;
    protected priorityList: string[] = RequirementUtil.priorityList;
    protected typeList: string[] = RequirementUtil.typeList;
    protected effortList: string[] = RequirementUtil.effortList;

    private valuesFormToDisableList: string[] = RequirementUtil.valuesFormToDisableList;
    private stakeholdersListToUpdate: StakeholdersModel[] = [];
    private dependenciesListToUpdate: RequirementsDataModel[] = [];
    private responsibleListToUpdate: UserResponseModel[] = [];

    constructor(private formBuilder: FormBuilder,
                private requirementService: RequirementsService,
                private projectsTableService: ProjectsTableService,
                private localStorageService: LocalStorageService,
                private stakeholderService: StakeholdersService,
                private userService: UsersService,
                private capitalizeFirstPipe: CapitalizeFirstPipePipe) {}

    ngOnInit() {
        this.disableFormWithUpdateRequirement();
        this.getCurrentProject();
        this.valuesFormToService();
        this.getCurrentStakeholders().then()
        this.getRequirementAnalysts().then()
        this.getRequirements().then()
        this.autoCompleteForm().then();
    }

    private disableFormWithUpdateRequirement() {
        for (let value of this.valuesFormToDisableList) {
            if (this.inputRequirementDataWithUpdateRequirement) {
                this.formGroup.get(`${value}`)?.disable();
            }
        }
    }

    private valuesFormToService() {
        this.formGroup.valueChanges.subscribe(val => {
            this.requirementService.updateForm(this.formGroup);
        });
    }

    private async autoCompleteForm() {

        if (this.inputRequirementDataWithUpdateRequirement) {
            await this.getDataWhenRelationshipWithRequirement();
        }

        this.formGroup.patchValue({
                projectRelated: this.getCurrentProject(),
                author: this.inputRequirementDataWithUpdateRequirement?.author ? this.inputRequirementDataWithUpdateRequirement.author : this.getCurrentAuthor(),
                version: this.inputRequirementDataWithUpdateRequirement?.version ? this.inputRequirementDataWithUpdateRequirement.version : 1,
                identifier: this.inputRequirementDataWithUpdateRequirement?.identifier,
                name: this.inputRequirementDataWithUpdateRequirement?.name ? this.inputRequirementDataWithUpdateRequirement.name : '',
                risk: this.inputRequirementDataWithUpdateRequirement?.risk ? this.inputRequirementDataWithUpdateRequirement.risk : '',
                priority: this.inputRequirementDataWithUpdateRequirement?.priority ? this.inputRequirementDataWithUpdateRequirement.priority : '',
                type: this.inputRequirementDataWithUpdateRequirement?.type ? this.inputRequirementDataWithUpdateRequirement.type : '',
                effort: this.inputRequirementDataWithUpdateRequirement?.effort ? this.inputRequirementDataWithUpdateRequirement.effort.toString() : '',
                description: this.inputRequirementDataWithUpdateRequirement?.description ? this.inputRequirementDataWithUpdateRequirement.description : '',
            }
        );
    }

    private async getDataWhenRelationshipWithRequirement() {
        return await this.requirementService.getRequirementDataToUpdate(this.inputRequirementDataWithUpdateRequirement?.id)
            .then(requirement => {
                this.stakeholdersListToUpdate = this.fontList
                    ?.filter(item => item.id !== undefined && requirement[0].stakeholderIds
                        .includes(item.id)) || [];

                this.responsibleListToUpdate = this.responsibleList
                    ?.filter(item => item.id !== undefined && requirement[0].responsibleIds
                        .includes(item.id)) || [];

                this.dependenciesListToUpdate = this.requirementsDependencies
                    ?.filter(item => item.id !== undefined && requirement[0].dependencyIds
                        .includes(item.id)) || [];

                this.formGroup.get('stakeholders')?.setValue(this.stakeholdersListToUpdate);
                this.formGroup.get('responsible')?.setValue(this.responsibleListToUpdate);
                this.formGroup.get('dependencies')?.setValue(this.dependenciesListToUpdate);
            });
    }

    private getCurrentProject() {
        return this.projectsTableService.getCurrentProjectByName();
    }

    protected getCurrentAuthor() {
        const author = this.localStorageService.getItem('name');
        return this.capitalizeFirstPipe.transform(author);
    }

    private async getCurrentStakeholders() {
        this.stakeholderService.getStakeholders().then(stakeholders => {
            this.fontList = stakeholders
        })
    }

    private async getRequirementAnalysts() {
        this.userService.getRequirementAnalysts().then(analysts => {
            this.responsibleList = analysts
        })
    }

    private async getRequirements() {
        this.requirementService.getRequirementsByProjectId(this.projectsTableService.getCurrentProjectById()).then(requirements => {
            requirements.sort((a, b) => a.identifier.localeCompare(b.identifier));
            this.requirementsDependencies = requirements;
        })
    }
}
