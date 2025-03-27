import { Component, OnInit, ElementRef, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import * as pdfjsLib from 'pdfjs-dist';
import { HeaderComponent } from '../../components/header/header.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ComicStatusComponent } from '../../components/comic-status/comic-status.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommentComponent } from '../../components/comment/comment.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comic-reader',
  standalone: true,
  imports: [
    NgForOf,
    HeaderComponent,
    FooterComponent,
    NgClass,
    CommentComponent,
    ButtonComponent,
  ],
  templateUrl: './comic-reader.component.html',
  styleUrl: './comic-reader.component.scss'
})
export class ComicReaderComponent implements OnInit, OnChanges {
  icons: { name: string, url: string }[] = [
    { name: 'Save', url: '/save.png' },
    { name: 'Like', url: '/like.png' },
    { name: 'Share', url: '/share.png' },
  ];
  @Input() status: string = 'Unknown';
  @Input() rating: number = 0;
  stars: number[] = [0, 1, 2, 3, 4];
  @Input() pdfUrl: string = "../../assets/COMIC castellano WEB_ok.pdf";
  title: string = '';
  comments: any[] = [];
  defaultUserIcon: string = 'https://randomuser.me/api/portraits/men/23.jpg';
  defaultUsername: string = 'Carlos Ruano Rachid';
  private destroy$ = new Subject<void>();

  @ViewChild('pdfCanvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContainter', { static: true }) pdfContainter!: ElementRef<HTMLDivElement>;
  @ViewChild('InputNumber', { static: false }) inputNumber!: ElementRef<HTMLInputElement>;

  private pdfDocument: any = null;
  maxPages = 0;
  InputNumber: number = 0;
  protected pageNumber: number = 1;
  scale = 0;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../../assets/pdf.worker.mjs';
  }

  ngOnInit(): void {
    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.loadComicData(comicId);

    }
    if (this.pdfUrl) {
      this.loadPdf();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && !changes['pdfUrl'].firstChange) {
      this.loadPdf();
    }
  }

  loadComicData(comicId: string): void {
    this.appService.getComicById(comicId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comic) => {
        if (comic) {
          this.title = comic.title || 'Untitled Comic';
          this.status = comic.state || 'Unknown';
          this.rating = comic.rating || 0;
          this.comments = comic.comments || [];
        }
      },
      error: (err) => {
        console.error('Error loading comic:', err);
      }
    });
  }


  async loadPdf(): Promise<void> {
    try {
      this.pdfDocument = await pdfjsLib.getDocument(this.pdfUrl).promise;
      this.maxPages = this.pdfDocument.numPages;
      await this.renderPage(this.pageNumber);
    } catch (error) {
      console.error('Error al cargar el PDF:', error);
    }
  }

  async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdfDocument) return;

    try {
      const page = await this.pdfDocument.getPage(pageNumber);

      const container = this.pdfContainter.nativeElement;
      const scale = container.clientWidth / page.getViewport({ scale: 2 }).width;

      const viewport = page.getViewport({ scale });
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;

    } catch (error) {
      console.error('Error al renderizar la página:', error);
    }
  }

  async nextPage(): Promise<void> {
    if (this.pageNumber < this.pdfDocument.numPages) {
      this.pageNumber++;
      this.renderPage(this.pageNumber);
    }
  }

  async prevPage(): Promise<void> {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.renderPage(this.pageNumber);
    }
  }

  pageInputChange(): void {
    this.InputNumber = parseInt(this.inputNumber.nativeElement.value);
    if (this.InputNumber > this.maxPages) {
      this.inputNumber.nativeElement.value = String(this.maxPages);
      this.renderPage(this.maxPages);
    } else {
      this.renderPage(this.InputNumber);
    }
  }

  pageChangeOnClick(evt: MouseEvent, pdfContainter: HTMLDivElement) {
    if (evt.pageX >= pdfContainter.clientWidth / 2) {
      this.nextPage();
    } else if (evt.pageX <= pdfContainter.clientWidth / 2) {
      this.prevPage();
    }
  }

  getStarClass(index: number): string {
    if (this.rating >= index + 1) {
      return 'filled';
    } else if (this.rating >= index + 0.5) {
      return 'half-filled';
    } else {
      return 'empty';
    }
  }

}
