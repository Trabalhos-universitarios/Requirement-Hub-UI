import {Component, ViewChild} from '@angular/core';
import {ThemeService} from "../../services/theme/theme.service";
import {MatDrawer} from "@angular/material/sidenav";
import {SidebarService} from "../../services/shared/sidebar/sidebar.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private themeService: ThemeService, private sidebarService: SidebarService) {
    this.themeService.initTheme();
  }

  ngAfterViewInit() {
    this.sidebarService.setDrawer(this.drawer);
  }
}
