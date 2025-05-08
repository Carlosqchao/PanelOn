import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
import {uploadComicService} from '../../../../backend/src/services/upload-comic.service';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, NgClass],
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  title = '';
  author = '';
  synopsis = '';
  state = '';
  selectedGenres: string[] = [];
  selectedGenre = '';
  selectedPegi: string | undefined = '';
  selectedFile: File | null = null;
  invalidFile = false;
  loadingStatus: 'loading' | 'clean' | 'nsfw' | null = null;
  isAnalyzingFile = false;
  isUploadingFile = false;
  formSubmitted = false;
  isSizeValid = true;
  genre: string[] = [];
  nsfwResult: { nsfw: boolean, pegi?: string } | null = null;
  filePreview = false;
  uploadSuccess = false;
  uploadError = false;
  rating: string =  "0";
  imagePreviews: string[] = [];
  modalVisible = false;


  constructor(private http: HttpClient, private AppService: AppService, private uploadService: uploadComicService) {}


  ngOnInit() {
    this.AppService.getGenres().subscribe(result => {
      this.genre = result.map(genre => genre.name);
    });
    this.closeModal();
  }

  addGenre(): void {
    if (this.selectedGenre && !this.selectedGenres.includes(this.selectedGenre)) {
      this.selectedGenres.push(this.selectedGenre);
      this.selectedGenre = '';
    } else if (this.selectedGenres.includes(this.selectedGenre)) {
      alert("This genre has already been added.");
    } else {
      alert("Please select a genre.");
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (file.size > 100000000) {
        this.isSizeValid = false;
        return;
      }

      this.isPDF(file).then(isPdf => {
        if (isPdf) {
          this.selectedFile = file;
          this.invalidFile = false;
          this.filePreview = true;
          this.isAnalyzingFile = true;
          this.loadingStatus = 'loading';

          const formData = new FormData();
          formData.append('file', this.selectedFile!);
          // @ts-ignore
          formData.append('pegi', this.selectedPegi);

          this.http.post<{ nsfw: boolean, pegi?: string }>('http://localhost:3000/check-nsfw', formData)
            .subscribe({
              next: (res) => {
                this.nsfwResult = res;
                this.loadingStatus = res.nsfw ? 'nsfw' : 'clean';
                this.isAnalyzingFile = false;
                this.selectedPegi = this.nsfwResult.pegi;

                if (this.nsfwResult.nsfw) {
                  this.getUploadedImages();
                  console.log(this.imagePreviews);
                }
              },
              error: (err) => {
                this.isAnalyzingFile = false;
                this.loadingStatus = null;
                console.error('Error al analizar el PDF:', err);
                alert('Ocurrió un error al verificar el PDF');
              }
            });
        } else {
          this.invalidFile = true;
          this.selectedFile = null;
          this.filePreview = false;
        }
      }).catch(() => {
        alert("Ocurrió un error al intentar verificar el archivo.");
        this.filePreview = false;
      });
    }
  }
  getUploadedImages(): void {
    this.http.get<string[]>('http://localhost:3000/get-images')
      .subscribe({
        next: (imageUrls) => {
          this.imagePreviews = imageUrls;
        },
        error: (err) => {
          console.error('Error al obtener las imágenes:', err);
          alert('Ocurrió un error al obtener las imágenes.');
        }
      });
  }

  onSubmit(form: NgForm): void {
    this.formSubmitted = true;
    this.uploadSuccess = false;
    this.uploadError = false;

    const isFormValid =
      this.isValidTitle() &&
      this.isValidAuthor() &&
      this.state !== '' &&
      this.selectedGenres.length > 0 &&
      this.selectedFile !== null &&
      !this.invalidFile &&
      this.loadingStatus === 'clean';

    if (isFormValid) {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('author', this.author);
      formData.append('synopsis', this.synopsis);
      formData.append('state', this.state);
      // @ts-ignore
      formData.append('pegi', this.selectedPegi);
      this.selectedGenres.forEach(genre => formData.append('genre', genre));
      formData.append('file', this.selectedFile!);

      this.isUploadingFile = true;

      this.http.post('http://localhost:3000/upload', formData).subscribe({
        next: (res: any) => {
          this.isUploadingFile = false;
          this.uploadSuccess = true;
          this.uploadService.uploadComic(res.comicId);
          form.resetForm();
          this.resetState();
          console.log(this.selectedGenre)
        },
        error: (error) => {
          this.isUploadingFile = false;
          this.uploadError = true;
          console.error('Error al subir:', error);
          alert('Ocurrió un error al subir el contenido.');
        }
      });
    }
  }


  resetState(): void {
    this.title = '';
    this.author = '';
    this.synopsis = '';
    this.state = '';
    this.selectedGenres = [];
    this.selectedGenre = '';
    this.selectedPegi = '';
    this.selectedFile = null;
    this.invalidFile = false;
    this.loadingStatus = null;
    this.formSubmitted = false;
    this.isSizeValid = true;
    this.nsfwResult = null;
    this.filePreview = false;
  }

  isPDF(file: File | null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        const header = String.fromCharCode(...arr.slice(0, 5));
        resolve(header === '%PDF-');
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file!.slice(0, 5));
    });
  }

  isValidTitle(): boolean {
    return /^[\p{L}\p{N}][\p{L}\p{N} .,:;!¡¿?\-']{0,48}[\p{L}\p{N}]$/u.test(this.title);
  }

  isValidAuthor(): boolean {
    return /^[\p{L}\p{N}][\p{L}\p{N} .,:;!¡¿?\-']{0,48}[\p{L}\p{N}]$/u.test(this.author);
  }

  isFileValid(): boolean {
    return this.selectedFile !== null && !this.invalidFile;
  }

  removeGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index !== -1) {
      this.selectedGenres.splice(index, 1);
    }
  }

  getShortFileName(fileName: string | undefined): string {
    return fileName && fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName || '';
  }

  openModal(): void {
    if (this.nsfwResult?.nsfw && this.loadingStatus !== 'loading') {
      this.modalVisible = true;
    }
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}
