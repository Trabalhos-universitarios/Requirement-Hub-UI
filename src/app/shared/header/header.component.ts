import { Component, OnInit } from '@angular/core';
import { SidebarService } from "../../services/sidebar/sidebar.service";
import { ThemeService } from "../../services/theme/theme.service";
import { UserAvatarComponent } from "../../components/user-avatar/user-avatar.component";
import { MatDialog } from "@angular/material/dialog";
import {LocalStorageService} from "../../services/localstorage/local-storage.service";
import {UsersService} from "../../services/users/users.service";
import {AlertService} from "../../services/sweetalert/alert.service";
import {reloadPage} from "../../utils/reload.page";
import {SpinnerService} from "../../services/spinner/spinner.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userProfilePicture: string | null = null;
  hasUserProfilePicture: boolean = false;

  constructor(
      protected themeService: ThemeService,
      private sidebarService: SidebarService,
      private dialog: MatDialog,
      private alertService: AlertService,
      private localStorageService: LocalStorageService,
      private router: Router,
  ) {}

  ngOnInit(): void {
    this.userProfilePicture = this.localStorageService.getItem('image');

    this.hasUserProfilePicture = !!this.userProfilePicture;
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

  openSidebar() {
    this.sidebarService.toggle();
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
}