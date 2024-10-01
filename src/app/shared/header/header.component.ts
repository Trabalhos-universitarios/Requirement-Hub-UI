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

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userProfilePicture: string | null = null;
    hasUserProfilePicture: boolean = false;
    tokenExpirationDate: Date | null = null;
    userNotification: number = 0;
    pageLoadTime: Date;
    intervalId: any;
    requirementIds: number[] = [];
    requirementList: RequirementsDataModel[] | undefined;

    constructor(
        protected themeService: ThemeService,
        private sidebarService: SidebarService,
        private dialog: MatDialog,
        private alertService: AlertService,
        private localStorageService: LocalStorageService,
        private cdr: ChangeDetectorRef,
        private userService: UsersService,
        private requirementsService: RequirementsService,
        private spinnerService: SpinnerService,
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

    getNotifications(): void {
        const userId = this.localStorageService.getItem('id');
        this.userService.getNotifications(userId).subscribe(resp => {
                this.userNotification = resp.length;
                this.requirementIds = resp
                console.log('Notifications:', resp.length);
            }
        )
    }

    isWithinTokenValid(): boolean {
        if (!this.tokenExpirationDate) {
            return false;
        }
        const currentTime = new Date();
        const hoursDifference = (this.tokenExpirationDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        return hoursDifference > 0 && hoursDifference <= 8;
    }

    getTooltipMessage(): string {
        return this.isWithinTokenValid() ? 'On-line' : 'Off-line';
    }

    openSidebar() {
        this.sidebarService.toggle();
    }

    handleButtonClick() {
        if (this.router.url !== '/home') {
            this.router.navigate(['/home']);
        } else {
            this.openSidebar();
        }
    }

    isHomeRoute(): boolean {
        return this.router.url === '/home';
    }

    toggleTheme() {
        if (this.themeService.isDarkMode()) {
            this.themeService.update('light-theme');
        } else {
            this.themeService.update('dark-theme');
        }
    }

    openAvatarUploader(): void {
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

    stylesIconColor(iconName: string) {

        let colorIcon: string = '#616161';
        if (this.themeService.isDarkMode()) {
            colorIcon = '#e0e0e0';
        }
        switch (iconName) {
            case "notifications_active":
                return {color: '#e17777'};
            default:
                return {color: colorIcon};
        }
    }

    getRequirementsById() {
        this.requirementsService.getRequirementsByIdsList(this.requirementIds).then(resp => {
            //this.spinnerService.start();
            this.requirementList = resp;
            //this.spinnerService.stop();
        });
    }

    async openInformationNotification(requirement: RequirementsDataModel[] | undefined) {

        if (requirement) {
            const userId = this.localStorageService.getItem('id');
            const requirementId = requirement[0].id

            await this.deleteNotificationByUser(userId, requirementId);

            if (this.localStorageService.getItem("role") === 'GERENTE_DE_PROJETOS' ||
                this.localStorageService.getItem("role") === 'ANALISTA_DE_REQUISITOS') {
                this.dialog.open(ModalDialogInformationRequirementNotificationComponent, {
                    width: '1200px',
                    data: requirement[0]
                })
            } else {
                this.dialog.open(ModalDialogInformationRequirementComponent, {
                    width: '1200px',
                    data: requirement[0]
                })
            }
        }
    }

    private async deleteNotificationByUser(userId: number, requirementId: number | undefined) {
        await this.userService.deleteNotifications(userId, requirementId).then();
    }
}
