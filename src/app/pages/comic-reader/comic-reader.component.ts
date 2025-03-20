import { Component, OnInit, ElementRef, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import {HeaderComponent} from "../../components/header/header.component";

@Component({
  selector: 'app-comic-reader',
  imports: [HeaderComponent],
  templateUrl: './comic-reader.component.html',
  styleUrl: './comic-reader.component.scss'
})
export class ComicReaderComponent implements OnInit, OnChanges {
  @ViewChild('pdfCanvas', {static: true}) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContainter', {static: true}) pdfContainter!: ElementRef<HTMLDivElement>;

  @Input()pdfUrl: string = "../../assets/Using_HTML5_Form_Validation.pdf";

  private pdfDocument: any = null;
  private pageNumber: number = 1;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../../assets/pdf.worker.mjs';
  }

  ngOnInit(): void {
    if (this.pdfUrl) {
      this.loadPdf();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfUrl'] && !changes['pdfUrl'].firstChange) {
      this.loadPdf();
    }
  }

  async loadPdf(): Promise<void> {
    try {
      // Carga el documento PDF
      this.pdfDocument = await pdfjsLib.getDocument(this.pdfUrl).promise;

      // Renderiza la primera página por defecto
      this.renderPage(this.pageNumber);
    } catch (error) {
      console.error('Error al cargar el PDF:', error);
    }
  }

  async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdfDocument) return;

    try {
      // Obtiene la página
      const page = await this.pdfDocument.getPage(pageNumber);

      const container= this.pdfContainter.nativeElement
      // Escala que determinará el tamaño de renderizado
      const scale = container.clientWidth / page.getViewport({scale:1}).width;

      // Viewport para la página
      const viewport = page.getViewport({scale});
// Canvas donde se renderizará la página
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');

      // Ajusta el tamaño del canvas al viewport
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Renderiza la página en el canvas
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
    if (this.pageNumber<this.pdfDocument.numPages)
        this.pageNumber++;
        this.renderPage(this.pageNumber);

  }
  async prevPage(): Promise<void> {
    if (this.pageNumber>0)
        this.pageNumber--;
        this.renderPage(this.pageNumber);

  }
}


