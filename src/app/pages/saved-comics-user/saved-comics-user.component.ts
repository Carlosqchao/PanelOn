import {Component, inject, OnInit} from '@angular/core';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {AuthService} from '../../../../backend/src/services/user-auth';
import {User} from '@angular/fire/auth';
import {IUser} from '../../models/user';
import {ComicCardComponent} from '../../components/comic-card/comic-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-saved-comics-user',
  imports: [
    HeaderBacklinkComponent,
    ComicCardComponent,
    NgForOf
  ],
  templateUrl: './saved-comics-user.component.html',
  styleUrl: './saved-comics-user.component.scss'
})
export class SavedComicsUserComponent implements OnInit {

  userStoreService = inject(UserStoreService);
  userAuthService: AuthService = inject(AuthService);
  user: User | null = null;
  userData: IUser | null = null;
  comics: any[] = [];
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.userAuthService.getCurrentUser().subscribe(user => this.user = user);
    this.userStoreService.getUser().subscribe(userData => this.userData = userData);
    this.appService.getSavedComics(this.user?.uid).subscribe(comics => {
      this.comics = comics;
    })
  }
}
