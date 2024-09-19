import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {RequirementsDataModel} from "../../../../models/requirements-data-model";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ThemeService} from "../../../../services/theme/theme.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ProjectsTableService} from "../../../../services/projects/projects-table.service";
import {UsersService} from "../../../../services/users/users.service";
import {SpinnerService} from "../../../../services/spinner/spinner.service";
import {CapitalizeFirstPipePipe} from "../../../../pipes/capitalize-first-pipe.pipe";
import {reloadPage} from "../../../../utils/reload.page";
import {AlertService} from "../../../../services/sweetalert/alert.service";
import {LocalStorageService} from 'src/app/services/localstorage/local-storage.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequirementsHistoryService } from 'src/app/services/requirements/requirement-history.service';
import { ModalDialogInformationRequirementHistoryComponent } from 'src/app/components/modals/requirements/modal-dialog-information-requirement-history/modal-dialog-information-requirement-history.component';

@Component({
  selector: 'app-requirement-history-table',
  templateUrl: './requirement-history-table.component.html',
  styleUrls: ['./requirement-history-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequirementHistoryTableComponent{
  protected displayedColumns: string[] = [
    'version', 'modification_date', 'priority', 'risk', 'effort', 'status'
  ];
  protected columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  protected dataSource = new MatTableDataSource<RequirementsDataModel>([]);
  protected expandedElement: RequirementsDataModel | undefined;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private requirementsService: RequirementsService,
              private requirementsHistoryService : RequirementsHistoryService,
              private sanitizer: DomSanitizer,
              private themeService: ThemeService,
              private matDialog: MatDialog,
              private projectsTableService: ProjectsTableService,
              private usersService: UsersService,
              private spinnerService: SpinnerService,
              private capitalizeFirstPipe: CapitalizeFirstPipePipe,
              private alertService: AlertService,
              private localStorage: LocalStorageService,
              @Inject(MAT_DIALOG_DATA) public data: RequirementsDataModel) {
    spinnerService.start();
    this.getData(data.identifier).then();
    this.setupCustomFilter();
  }

  protected async getData(identifier: string) {
    this.requirementsHistoryService.getRequirementHistoryByIdentifier(identifier, this.getCurrentProjectById()).then(response => {
      response.sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
      this.dataSource.data = response;

      this.spinnerService.stop();
    });
  }

  private getCurrentProjectById() {
    return this.projectsTableService.getCurrentProjectById();
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
      this.localStorage.getItem('role') === "GERENTE_DE_PROJETOS"    
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

  protected async openDialog(action: String, value: RequirementsDataModel) {
    switch (action) {
      case "information":
        this.matDialog.open(ModalDialogInformationRequirementHistoryComponent, {
          data: value,
          width: '1200px',
          disableClose: true
        });
        break;
      default:
        console.error("This dialog non exists!");
    }
  }

  protected async deleteRequirement(id: number) {
    const result = await this.alertService.toOptionalActionAlert(
      "Deletar historico",
      "Deseja realmente excluir o historico requisito?"
    );
    this.spinnerService.start();
  
    if (result.isConfirmed) {
      await this.requirementsHistoryService.deleteHistory(id).then(response => {
        if (response) {
          setTimeout(() => {
            this.alertService.toSuccessAlert("Historico requisito excluído com sucesso!");
          }, 2000);
        }
      });
      reloadPage();
    }
  }
}

