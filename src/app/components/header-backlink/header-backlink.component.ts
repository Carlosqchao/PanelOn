import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header-backlink',
  imports: [
    RouterLink
  ],
  templateUrl: './header-backlink.component.html',
  standalone: true,
  styleUrl: './header-backlink.component.scss'
})
export class HeaderBacklinkComponent {

}
