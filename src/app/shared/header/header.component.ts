import { Component } from '@angular/core';
import {SidebarService} from "../../services/core/sidebar/sidebar.service";
import {ThemeService} from "../../services/theme/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(protected themeService: ThemeService, private sidebarService: SidebarService) {}

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
}
