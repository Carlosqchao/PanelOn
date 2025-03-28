import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { User } from '@angular/fire/auth';
import {AuthService} from '../../../../backend/src/services/user-auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private lastScroll = 0;
  public isVisible = true;
  public user: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

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

  logout() {
    this.authService.logout();
  }
}
