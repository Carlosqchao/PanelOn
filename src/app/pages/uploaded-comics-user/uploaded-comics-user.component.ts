import {Component, inject, OnInit} from '@angular/core';
import {ComicCardComponent} from '../../components/comic-card/comic-card.component';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {NgForOf} from '@angular/common';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {AuthService} from '../../../../backend/src/services/user-auth';
import {User} from '@angular/fire/auth';
import {IUser} from '../../models/user';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-uploaded-comics-user',
  imports: [
    ComicCardComponent,
    HeaderBacklinkComponent,
    NgForOf
  ],
  templateUrl: './uploaded-comics-user.component.html',
  styleUrl: './uploaded-comics-user.component.scss'
})
export class UploadedComicsUserComponent implements OnInit {
  userStoreService = inject(UserStoreService);
  userAuthService: AuthService = inject(AuthService);
  user: User | null = null;
  userData: IUser | null = null;
  comics: any[] = [];
  private router = inject(Router);
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.userAuthService.getCurrentUser().subscribe(user => this.user = user);
    this.userStoreService.getUser().subscribe(userData => this.userData = userData);
    this.appService.getUploadedComics(this.user?.uid).subscribe(comics => {
      this.comics = comics;
    })
  }

  goToEditPage(comicId: string) {
    this.router.navigate(['/edit-comic', comicId]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  async deleteComic(id: string) {
    await this.appService.deleteComic(id);
  }
}
