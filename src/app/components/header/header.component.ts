import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgClass, NgIf, isPlatformBrowser, CommonModule} from '@angular/common';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../backend/src/services/user-auth';
import { IUser } from '../../models/user';
import { UserStoreService } from '../../../../backend/src/services/user-store';
import {ThemeService} from '../../../../backend/src/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {LanguageService} from '../../language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    NgIf,
    TranslateModule,
    FormsModule,
    CommonModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private lastScroll = 0;
  public isVisible = true;
  public user: User | null = null;
  public userData: IUser | null = null;
  public showDropdown = false;
  public isMobile = false;
  public mobileMenuOpen = false;
  public isDarkMode: boolean = false;
  private userSubscription: Subscription | undefined;
  private userDataSubscription: Subscription | undefined;
  public currentLang: string;
  languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];
  dropdownLangOpen = false;


  @ViewChild('profileMenu') profileMenu!: ElementRef;

  constructor(
    private authService: AuthService,
    private userStore: UserStoreService,
    public languageService: LanguageService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang = this.languageService.getCurrentLang();
  }

  ngOnInit() {
    this.checkScreenSize();
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });

    this.userDataSubscription = this.userStore.user$.subscribe((userData: IUser | null) => {
      this.userData = userData;
    });

    this.isDarkMode = this.themeService.isDark();

    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile && this.mobileMenuOpen) {
        this.mobileMenuOpen = false;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const currentScroll = window.scrollY;

      if (currentScroll <= 0) {
        this.isVisible = true;
        return;
      }

      if (!this.isVisible) {
        this.mobileMenuOpen = false;
      }

      if (currentScroll > this.lastScroll && currentScroll > 100) {
        this.isVisible = false;
      } else if (currentScroll < this.lastScroll) {
        this.isVisible = true;
      }

      this.lastScroll = currentScroll;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showDropdown && this.profileMenu && !this.profileMenu.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleDropdown() {
    this.dropdownLangOpen = false;
    this.showDropdown = !this.showDropdown;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.showDropdown = false;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    if (this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  toggleDropdownLang() {
    this.dropdownLangOpen = !this.dropdownLangOpen;
  }

  selectLanguage(langCode: string) {
    this.currentLang = langCode;
    this.dropdownLangOpen = false;
    this.changeLanguage(langCode);
  }

  getLanguageName(code: string): string {
    return this.languages.find(l => l.code === code)?.name || code;
  }
}
