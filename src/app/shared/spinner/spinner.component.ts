import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

}
