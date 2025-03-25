import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
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
  @ViewChild('InputNumber',{static: false}) inputNumber!: ElementRef<HTMLInputElement>;
  @Input()pdfUrl: string = "../../assets/COMIC castellano WEB_ok.pdf";


  private pdfDocument: any = null;
  maxPages=0;
  InputNumber: number=0;
  protected pageNumber: number = 1;
  scale=0;


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
      this.pdfDocument = await pdfjsLib.getDocument(this.pdfUrl).promise;
      this.maxPages=this.pdfDocument.numPages;
      await this.renderPage(this.pageNumber);
    } catch (error) {
      console.error('Error al cargar el PDF:', error);
    }
  }

  async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdfDocument) return;

    try {
      const page = await this.pdfDocument.getPage(pageNumber);

      const container= this.pdfContainter.nativeElement
      const scale = container.clientWidth / page.getViewport({scale:1.25}).width;


      const viewport = page.getViewport({scale});
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
    if (this.pageNumber<this.pdfDocument.numPages)
        this.pageNumber++;
        this.renderPage(this.pageNumber);

  }
  async prevPage(): Promise<void> {
    if (this.pageNumber>0)
        this.pageNumber--;
        this.renderPage(this.pageNumber);

  }

  pageInputChange(): void {
    this.InputNumber = parseInt(this.inputNumber.nativeElement.value);
    if (this.InputNumber>this.maxPages){
      this.inputNumber.nativeElement.value = String(this.maxPages);
      this.renderPage(this.maxPages);
    }else{
      this.renderPage(this.InputNumber)
    }
  }

  pageChangeOnClick(evt: MouseEvent, pdfContainter: HTMLDivElement) {
    if (evt.pageX>=pdfContainter.clientWidth/2){
        this.nextPage();
    }else if (evt.pageX<=pdfContainter.clientWidth/2){
      this.prevPage();
    }
  }
}


