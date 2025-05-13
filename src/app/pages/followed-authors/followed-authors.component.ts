
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorSaveService } from '../../../../backend/src/services/author-save.service';
import { HeaderBacklinkComponent } from '../../components/header-backlink/header-backlink.component';
import { AuthorCardComponent } from '../../components/author-card/author-card.component';
import { NgIf, NgFor } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../models/user';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-followed-authors',
  standalone: true,
  imports: [HeaderBacklinkComponent, AuthorCardComponent, NgIf, NgFor, TranslateModule],
  templateUrl: './followed-authors.component.html',
  styleUrls: ['./followed-authors.component.scss']
})
export class FollowedAuthorsComponent implements OnInit, OnDestroy {
  authors: IUser[] = [];
  private destroy$ = new Subject<void>();

  constructor(private authorSaveService: AuthorSaveService) {}

  ngOnInit(): void {
    this.authorSaveService.getSavedAuthors().then(authors => {
      this.authors = authors;
    }).catch(err => {
      console.error('Error loading followed authors:', err);
      this.authors = [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
