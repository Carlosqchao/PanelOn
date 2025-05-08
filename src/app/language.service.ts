import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '@angular/fire/auth';
import { IUser } from './models/user';
import { AuthService } from '../../backend/src/services/user-auth';
import { UserStoreService } from '../../backend/src/services/user-store';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private user: User | null = null;
  private userData: IUser | null = null;
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  availableLanguages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'it', name: 'IT' },
    { code: 'pt', name: 'PT' },
  ];

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private userStore: UserStoreService,
    private appService: AppService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initLanguage();
  }

  private initLanguage() {
    this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });

    this.userStore.user$.subscribe((userData: IUser | null) => {
      this.userData = userData;

      const savedLang = userData?.language;
      const browserLang = this.translate.getBrowserLang();
      const lang = this.getValidLanguage(savedLang || browserLang);

      this.setLanguage(lang);
    });
  }

  private getValidLanguage(lang: string | undefined): string {
    return this.availableLanguages.some(l => l.code === lang) ? lang! : 'en';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
    }

    if (this.user?.uid) {
      this.appService.updateUser(this.user.uid, { language: lang })
        .catch(err => console.error('Error change language:', err));
    }
  }

  getCurrentLang(): string {
    return this.currentLang.getValue();
  }
}
