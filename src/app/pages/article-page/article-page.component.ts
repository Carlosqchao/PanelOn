import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { News } from '../../models/new';
import Swal from 'sweetalert2';
import {ClipboardService} from '../../../../backend/src/services/copy-link-service';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit, OnDestroy {
  news: News | null = null;
  img_share: string = "/share.png";
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private clipBoardService: ClipboardService
  ) {}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    if (newsId) {
      this.appService.getNewsById(newsId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (news) => {
          if (news) {
            this.news = {
              id: newsId,
              title: news.title || '',
              author: news.author || '',
              content: news.content || '',
              image: news.image || '',
              published: news.published || ''
            };
          }
        },
        error: (err) => {
          console.error('Error cargando la noticia:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyLink() {
    this.clipBoardService.copyPageUrl()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Link Copied!',
          text: 'The link has been copied to the clipboard.',
          timer: 2000,
          showConfirmButton: false
        });
      })
      .catch(err => {
        console.error('Error copying:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to copy the link.',
          timer: 2000,
          showConfirmButton: false
        });
      });
  }

}
