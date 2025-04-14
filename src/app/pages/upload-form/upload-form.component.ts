import {Component, input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ButtonComponent} from '../../components/button/button.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, ButtonComponent, NgClass],
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent {
  title = '';
  author = '';
  synopsis = '';
  situation = '';
  selectedGenres: string[] = [];
  selectedGenre = '';
  selectedPegi = '';
  selectedFile: File | null = null;
  invalidFile: boolean = false;
  loadingStatus: 'loading' | 'clean' | 'nsfw' | null = null;
  isLoading: boolean = false;
  formSubmitted = false;
  isSizeValid: boolean = true;

  constructor(private http: HttpClient) {}
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

  filePreview = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.loadingStatus = null;
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
          this.isLoading = true;
          this.loadingStatus = 'loading';

          const formData = new FormData();
          formData.append('file', this.selectedFile);

          this.http.post<{ nsfw: boolean }>('http://localhost:3000/check-nsfw', formData)
            .subscribe({
              next: (res) => {
                this.loadingStatus = res.nsfw ? 'nsfw' : 'clean';
                this.isLoading = false;
              },
              error: (err) => {
                this.isLoading = false;
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


  onSubmit(): void {
    this.formSubmitted = true;

    const isFormValid =
      this.isValidTitle() &&
      this.isValidAuthor() &&
      this.situation != '' &&
      this.selectedGenres.length > 0 &&
      this.isPegiSelected() &&
      this.selectedFile !== null &&
      !this.invalidFile &&
      this.loadingStatus === 'clean';

      console.log(isFormValid);

    if (isFormValid) {
      console.log("Uploading form");
      return;
    }
}



  isPDF(file: File | null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        const header = String.fromCharCode(...arr.slice(0, 5));
        const isPdf = header === '%PDF-';

        if (!isPdf) {
          console.warn('File is not PDF.');
        }

        resolve(isPdf);
      };

      reader.onerror = function () {
        console.error('Error reading file.');
        reject(reader.error);
      };

      // @ts-ignore
      reader.readAsArrayBuffer(file.slice(0, 5));
    });
  }
  isValidTitle(): boolean {
    return /^[\p{L}\p{N}][\p{L}\p{N} .,:;!¡¿?\-']{0,48}[\p{L}\p{N}]$/u.test(this.title);
  }

  isValidAuthor(): boolean {

    return /^[\p{L}\p{N}][\p{L}\p{N} .,:;!¡¿?\-']{0,48}[\p{L}\p{N}]$/u.test(this.author);
  }
  isPegiSelected(): boolean {
    return this.selectedPegi !== '';
  }
  isFileValid(): boolean {
    return this.selectedFile !== null && !this.invalidFile;
  }

}
