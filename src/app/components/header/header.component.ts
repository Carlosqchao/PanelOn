import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private lastScroll = 0;
  public isVisible = true;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    let currentScroll: number;
    currentScroll = window.scrollY;

    if (currentScroll <= 0) {
      this.isVisible = true;
      return;
    }

    if (currentScroll > this.lastScroll && currentScroll > 100) {
      this.isVisible = false;
    } else if (currentScroll < this.lastScroll) {
      this.isVisible = true;
    }

    this.lastScroll = currentScroll;
  }
}
