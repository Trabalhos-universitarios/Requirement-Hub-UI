import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {RequirementsService} from "../../../../services/requirements/requirements.service";
import {DataModel} from "./model/data-model";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ThemeService} from "../../../../services/theme/theme.service";
import {Status} from "../../../../utils/util.status";

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
    dataSource = new MatTableDataSource<DataModel>;
    displayedColumns: string[] =
        [
            'identifierRequirement',
            'nameRequirement',
            'authorRequirement',
            'creationDate',
            'priorityRequirement',
            'typeRequirement',
            'versionRequirement',
            'status',
        ];
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    expandedElement: DataModel | undefined;

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    constructor(private requirementsService: RequirementsService, private sanitizer: DomSanitizer, private themeService: ThemeService) {
        this.getData();
    }

    ngAfterViewInit() {
        this.paginator ? this.dataSource.paginator = this.paginator : null;
    }

    getData() {
        this.requirementsService.getRequirements().subscribe(requirements => {
            this.dataSource.data = requirements;
            console.log(this.dataSource.data)
        })
    }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    getStatusIcon(status: string) {
        switch (status) {
            case Status.ACTIVE:
                return { icon: 'verified', name: 'Ativo' };
            case Status.DRAFT:
                return { icon: 'pending_actions', name: 'Rascunho' };
            case Status.PENDING:
                return { icon: 'schedule', name: 'Pendente' };
            case Status.APPROVE:
                return { icon: 'preliminary', name: 'Aprovado' };
            case Status.CREATED:
                return { icon: 'pending', name: 'Criado' };
            case Status.REFUSE:
                return { icon: 'brightness_alert', name: 'Recusado' };
            default:
                return { icon: 'help', name: 'Status desconhecido' };
        }
    }

    stylesIconColor(iconName: string) {
        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }
        switch (iconName) {
            case 'verified':
                return { color: '#4CAF50' };
            case 'pending_actions':
                return { color: colorIcon };
            case 'schedule':
                return { color: '#FFD54F' };
            case 'preliminary':
                return { color: '#4CAF50' };
            case 'pending':
                return { color: '#A5D6A7' };
            case 'brightness_alert':
                return { color: colorIcon };
            default:
                return { color: '#f44336' };
        }
    }
}
