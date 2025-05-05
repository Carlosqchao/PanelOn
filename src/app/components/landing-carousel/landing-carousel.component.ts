import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface CarouselItem {
  id: number;
  title: string;
  image: string;
  description?: string;
  newsId?: string;
}

@Component({
  selector: 'app-landing-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-carousel.component.html',
  styleUrls: ['./landing-carousel.component.scss']
})
export class LandingCarouselComponent implements OnInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() autoSlide: boolean = false;
  @Input() slideInterval: number = 3000;

  currentIndex: number = 0;
  timeoutId?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.autoSlide && isPlatformBrowser(this.platformId)) {
      this.autoSlideImages();
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId && isPlatformBrowser(this.platformId)) {
      window.clearTimeout(this.timeoutId);
    }
  }

  selectItem(index: number): void {
    this.currentIndex = index;
    if (this.autoSlide && isPlatformBrowser(this.platformId)) {
      this.resetTimer();
    }
  }

  getClickHandler(index: number): (event: MouseEvent) => void {
    return () => {
      const item = this.items[index];
      const newsId = item?.newsId;
      if (newsId) {
        this.router.navigate(['news', newsId]).then(success => {
          if (success) {
            window.scrollTo(0, 0);
          }
        });
      }
    };
  }

  onPrevClick(): void {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    if (this.autoSlide && isPlatformBrowser(this.platformId)) {
      this.resetTimer();
    }
  }

  onNextClick(): void {
    this.currentIndex = this.currentIndex === this.items.length - 1 ? 0 : this.currentIndex + 1;
    if (this.autoSlide && isPlatformBrowser(this.platformId)) {
      this.resetTimer();
    }
  }

  resetTimer(): void {
    if (this.timeoutId && isPlatformBrowser(this.platformId)) {
      window.clearTimeout(this.timeoutId);
    }
    this.autoSlideImages();
  }

  autoSlideImages(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timeoutId = window.setTimeout(() => {
        this.onNextClick();
      }, this.slideInterval);
    }
  }
}
