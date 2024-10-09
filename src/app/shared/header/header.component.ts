import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SidebarService} from "../../services/sidebar/sidebar.service";
import {ThemeService} from "../../services/theme/theme.service";
import {UserAvatarComponent} from "../../components/user-avatar/user-avatar.component";
import {MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../services/localstorage/local-storage.service";
import {AlertService} from "../../services/sweetalert/alert.service";
import {reloadPage} from "../../utils/reload.page";
import {jwtDecode} from "jwt-decode";
import {UsersService} from "../../services/users/users.service";
import {RequirementsService} from "../../services/requirements/requirements.service";
import {RequirementsDataModel} from "../../models/requirements-data-model";
import {SpinnerService} from "../../services/spinner/spinner.service";
import { Router } from '@angular/router';
import {
    RequirementHistoryTableComponent
} from "../../components/tables/requirements/requirement-history-table/requirement-history-table.component";
import {
    ModalDialogInformationRequirementNotificationComponent
} from "../../components/modals/requirements/modal-dialog-information-requirement-notification/modal-dialog-information-requirement-notification.component";
import {
    ModalDialogInformationRequirementComponent
} from "../../components/modals/requirements/modal-dialog-information-requirement/modal-dialog-information-requirement.component";
import {Status} from "../../utils/util.status";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    protected userProfilePicture: string | null = null;
    protected hasUserProfilePicture: boolean = false;
    protected requirementList: RequirementsDataModel[] | undefined;
    protected userNotification: number = 0;
    protected pageLoadTime: Date;
    private tokenExpirationDate: Date | null = null;
    private intervalId: any;
    private requirementIds: number[] = [];


    constructor(
        protected themeService: ThemeService,
        private sidebarService: SidebarService,
        private dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private cdr: ChangeDetectorRef,
        private userService: UsersService,
        private requirementsService: RequirementsService,
        private router: Router,
    ) {
        this.pageLoadTime = new Date();
    }

    ngOnInit(): void {
        this.userProfilePicture = this.localStorageService.getItem('image');
        this.hasUserProfilePicture = !!this.userProfilePicture;
        this.getNotifications();
        this.checksForChanges();
        this.verifyTokenIsValid();
    }

    private checksForChanges() {
        this.intervalId = setInterval(() => {
            this.cdr.detectChanges();
        }, 1000);
    }

    private verifyTokenIsValid() {
        const token = this.localStorageService.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            this.tokenExpirationDate = new Date(decodedToken.exp * 1000);

            console.log('Token expiration date:', this.tokenExpirationDate);

        }
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private getNotifications(): void {
        const userId = this.localStorageService.getItem('id');
        this.userService.getNotifications(userId).subscribe(resp => {
                this.userNotification = resp.length;
                this.requirementIds = resp
                console.log('Notifications:', resp.length);
            }
        )
    }

    protected isWithinTokenValid(): boolean {
        if (!this.tokenExpirationDate) {
            return false;
        }
        const currentTime = new Date();
        const hoursDifference = (this.tokenExpirationDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        return hoursDifference > 0 && hoursDifference <= 8;
    }

    protected getTooltipMessage(): string {
        return this.isWithinTokenValid() ? 'On-line' : 'Off-line';
    }

    private openSidebar() {
        this.sidebarService.toggle();
    }

    protected handleButtonClick() {
        if (this.router.url !== '/home') {
            this.router.navigate(['/home']).then();
        } else {
            this.openSidebar();
        }
    }

    protected isHomeRoute(): boolean {
        return this.router.url === '/home';
    }

    protected toggleTheme() {
        if (this.themeService.isDarkMode()) {
            this.themeService.update('light-theme');
        } else {
            this.themeService.update('dark-theme');
        }
    }

    protected openAvatarUploader(): void {
        const dialogRef = this.dialog.open(UserAvatarComponent, {
            width: '400px',
            height: '400px',
            data: this.userProfilePicture
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userProfilePicture = result;
                this.hasUserProfilePicture = true;
                reloadPage();
            }
        });
    }

    protected stylesIconColor(requirementStatus: string | undefined) {

        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }

        switch (requirementStatus) {
            case Status.REJECTED:
                return {color: '#e17777'};
            case Status.PENDING:
                return {color: '#FFD54F'};
            case Status.ACTIVE:
                return {color: '#4CAF50'};
            case Status.BLOCKED:
                    return {color: '#e17777'};
            default:
                return {color: colorIcon};
        }
    }

    protected getRequirementsById() {
        this.requirementsService.getRequirementsByIdsList(this.requirementIds).then(resp => {
            this.requirementList = resp;
        });
    }

    protected async openInformationNotification(requirement: RequirementsDataModel| undefined) {

        if (requirement) {
            const userId = this.localStorageService.getItem('id');
            const requirementId = requirement.id

            await this.deleteNotificationByUser(userId, requirementId);

            if (this.localStorageService.getItem("role") === 'GERENTE_DE_PROJETOS') {
                this.dialog.open(ModalDialogInformationRequirementNotificationComponent, {
                    width: '1200px',
                    data: requirement
                })
            } else {
                this.dialog.open(ModalDialogInformationRequirementComponent, {
                    width: '1200px',
                    data: requirement
                })
            }
        }
    }

    private async deleteNotificationByUser(userId: number, requirementId: number | undefined) {
        await this.userService.deleteNotifications(userId, requirementId).then();
    }
}
