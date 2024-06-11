import { Injectable } from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private drawer!: MatDrawer;

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  toggle(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
}
