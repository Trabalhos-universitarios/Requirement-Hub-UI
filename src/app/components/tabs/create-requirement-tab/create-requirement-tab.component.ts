import {Component} from '@angular/core';

@Component({
  selector: 'app-create-requirement-tab',
  templateUrl: './create-requirement-tab.component.html',
  styleUrls: ['./create-requirement-tab.component.scss']
})
export class CreateRequirementTabComponent {

  indexTab: number = 0;
  tabDisabled: boolean = false;

  onTabChange(index: any) {
    this.indexTab = index
    if (index === 1) {
      this.tabDisabled = true;
    }
  }
}
