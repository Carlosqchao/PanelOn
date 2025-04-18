import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../backend/src/services/user-auth';
import {IUser} from '../../models/user';
import {UserStoreService} from '../../../../backend/src/services/user-store';


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
export class HeaderComponent implements OnInit, OnDestroy {
  private lastScroll = 0;
  public isVisible = true;
  public user: User | null = null;
  public userData: IUser | null = null;
  private userSubscription: Subscription;
  private userDataSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userStore: UserStoreService
  ) {
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });

    this.userDataSubscription = this.userStore.user$.subscribe((userData: IUser | null) => {
      this.userData = userData;
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.userData = this.userStore.getUser();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
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
