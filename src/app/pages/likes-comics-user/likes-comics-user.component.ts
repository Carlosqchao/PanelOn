import {Component, inject, OnInit} from '@angular/core';
import {ComicCardComponent} from '../../components/comic-card/comic-card.component';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {NgForOf} from '@angular/common';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {AuthService} from '../../../../backend/src/services/user-auth';
import {User} from '@angular/fire/auth';
import {IUser} from '../../models/user';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-likes-comics-user',
  imports: [
    ComicCardComponent,
    HeaderBacklinkComponent,
    NgForOf
  ],
  templateUrl: './likes-comics-user.component.html',
  styleUrl: './likes-comics-user.component.scss'
})
export class LikesComicsUserComponent implements OnInit {
  userStoreService = inject(UserStoreService);
  userAuthService: AuthService = inject(AuthService);
  user: User | null = null;
  userData: IUser | null = null;
  comics: any[] = [];
  constructor(private appService: AppService) {}

  ngOnInit() {
    this.userAuthService.getCurrentUser().subscribe(user => this.user = user);
    this.userStoreService.getUser().subscribe(userData => this.userData = userData);
    this.appService.getLikedComics(this.user?.uid).subscribe(comics => {
      this.comics = comics;
    })
  }
}
