import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselItem {
  id: number;
  title: string;
  imageUrl: string;
  description?: string;
}

@Component({
  selector: 'app-landing-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-carousel.component.html',
  styleUrls: ['./landing-carousel.component.scss']
})
export class LandingCarouselComponent implements OnInit {
  @Input() items: CarouselItem[] = [];
  @Input() autoSlide: boolean = false;
  @Input() slideInterval: number = 3000;

  currentIndex: number = 0;
  timeoutId?: number;

  ngOnInit(): void {
    if (this.autoSlide) {
      this.autoSlideImages();
    }
  }

  selectItem(index: number): void {
    this.currentIndex = index;
    if (this.autoSlide) {
      this.resetTimer();
    }
  }

  onPrevClick(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.items.length - 1;
    } else {
      this.currentIndex--;
    }

    if (this.autoSlide) {
      this.resetTimer();
    }
  }

  onNextClick(): void {
    if (this.currentIndex === this.items.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }

    if (this.autoSlide) {
      this.resetTimer();
    }
  }

  resetTimer(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.autoSlideImages();
  }

  autoSlideImages(): void {
    this.timeoutId = window.setTimeout(() => {
      this.onNextClick();
    }, this.slideInterval);
  }
}
