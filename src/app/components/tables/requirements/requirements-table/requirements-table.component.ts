import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ThemeService} from "../../../../services/theme/theme.service";
import {MatDialog} from "@angular/material/dialog";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {UsersService} from "../../../../services/users/users.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {CapitalizeFirstPipePipe} from "../../../../pipes/capitalize-first-pipe.pipe";
import {reloadPage} from "../../../../utils/reload.page";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {LocalStorageService} from 'src/app/services/localstorage/local-storage.service';
import {ModalDialogInformationRequirementComponent} from 'src/app/components/modals/requirements/modal-dialog-information-requirement/modal-dialog-information-requirement.component';
import {ModalDialogArtifactsRequirementComponent} from 'src/app/components/modals/requirements/modal-dialog-artifacts-requirement/modal-dialog-artifacts-requirement.component';
import {ModalDialogUpdateRequirementComponent} from "../../../modals/requirements/modal-dialog-update-requirement/modal-dialog-update-requirement.component";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-requirements-table',
  templateUrl: './requirements-table.component.html',
  styleUrls: ['./requirements-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequirementsTableComponent implements AfterViewInit {
  protected displayedColumns: string[] = [
    'identifier', 'name', 'author', 'dateCreated', 'priority', 'type', 'version', 'status'
  ];
  protected columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  protected dataSource = new MatTableDataSource<RequirementsDataModel>([]);
  protected expandedElement: RequirementsDataModel | undefined;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private requirementsService: RequirementsService,
              private sanitizer: DomSanitizer,
              private themeService: ThemeService,
              private matDialog: MatDialog,
              private projectsTableService: ProjectsTableService,
              private usersService: UsersService,
              private spinnerService: SpinnerService,
              private capitalizeFirstPipe: CapitalizeFirstPipePipe,
              private alertService: AlertService,
              private localStorage: LocalStorageService) {
    spinnerService.start();
    this.getData().then();
    this.setupCustomFilter();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  protected async getData() {
    this.requirementsService.getRequirementsByProjectId(this.getCurrentProjectById()).then(response => {
      response.forEach(async requirement => {
        requirement.author = await this.getAuthorById(requirement.author).then();
      });
      response.sort((a, b) => a.identifier.localeCompare(b.identifier));
      this.dataSource.data = response;
      this.spinnerService.stop();
    });
  }

  private getCurrentProjectById() {
    return this.projectsTableService.getCurrentProjectById();
  }

  protected getCurrentProjectByName() {
    return this.projectsTableService.getCurrentProjectByName();
  }

  private async getAuthorById(id: number | undefined) {
    let author = await this.usersService.getUserById(id).then(user => user.name);
    return this.capitalizeFirstPipe.transform(author);
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setupCustomFilter() {
    this.dataSource.filterPredicate = (data: RequirementsDataModel, filter: string): boolean => {
      const filterValue = filter.trim().toLowerCase();

      return (
        (data.identifier ? data.identifier.toLowerCase().includes(filterValue) : false) ||
        (data.name ? data.name.toLowerCase().includes(filterValue) : false) ||
        (data.author ? data.author.toString().includes(filterValue) : false) ||
        (data.dateCreated ? data.dateCreated.toString().includes(filterValue) : false) ||
        (data.priority ? data.priority.toLowerCase().includes(filterValue) : false) ||
        (data.type ? data.type.toLowerCase().includes(filterValue) : false) ||
        (data.version ? data.version.toLowerCase().includes(filterValue) : false) ||
        (data.status ? data.status.toLowerCase().includes(filterValue) : false)
      );
    };
  }

  protected sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  isPermitted() {
    return !(
      this.localStorage.getItem('role') === "GERENTE_DE_PROJETOS" ||
      this.localStorage.getItem('role') === "ANALISTA_DE_REQUISITOS" ||
      this.localStorage.getItem('role') === "ANALISTA_DE_NEGOCIO"
    );
  }

  protected getStatusIcon(status: string) {
    switch (status) {
      case "ACTIVE":
        return {icon: 'verified', name: 'ACTIVE'};
      case "REJECTED":
        return {icon: 'do_not_disturb_on', name: 'REJECTED'};
      case "PENDING":
        return {icon: 'schedule', name: 'PENDING'};
      case "APPROVE":
        return {icon: 'preliminary', name: 'APPROVE'};
      case "CREATED":
        return {icon: 'pending', name: 'CREATED'};
      case "BLOCKED":
        return {icon: 'block', name: 'BLOCKED'};
      default:
        return {icon: 'help', name: 'UNKNOWN'};
    }
  }

  protected stylesIconColor(iconName: string) {
    let colorIcon: string = '#616161';
    if (this.themeService.isDarkMode()) {
      colorIcon = '#e0e0e0';
    }
    switch (iconName) {
      case 'verified':
        return {color: '#4CAF50'};
      case 'pending_actions':
        return {color: `${colorIcon}`};
      case 'schedule':
        return {color: '#FFD54F'};
      case 'preliminary':
        return {color: '#4CAF50'};
      case 'pending':
        return {color: '#A5D6A7'};
      case 'do_not_disturb_on':
        return {color: 'rgba(253,0,0,0.74)'};
      case 'block':
        return {color: 'rgba(253,0,0,0.74)'};
      default:
        return {color: `${colorIcon}`};
    }
  }

  protected openDialog(action: String, value: RequirementsDataModel) {
    switch (action) {
      case "information":
        this.matDialog.open(ModalDialogInformationRequirementComponent, {
          data: value,
          width: '1200px',
          disableClose: true
        });
        break;
      case "edit":
        this.matDialog.open(ModalDialogUpdateRequirementComponent, {
          data: value,
          width: '1000px',
          disableClose: true
        });
        break;
      case "add":
        this.matDialog.open(ModalDialogArtifactsRequirementComponent, {
          data: value,
          disableClose: true
        });
        break;
      default:
        console.error("This dialog non exists!");
    }
  }

  protected async deleteRequirement(id: number) {
    const result = await this.alertService.toOptionalActionAlert(
      "Deletar requisito",
      "Deseja realmente excluir o requisito?"
    );

    if (result.isConfirmed) {
      await this.requirementsService.deleteRequirement(id).then(response => {
        if (response) {
          this.alertService.toSuccessAlert("Requisito excluído com sucesso!");
        }
      });
      this.spinnerService.start();
      reloadPage();
    }
  }
}
