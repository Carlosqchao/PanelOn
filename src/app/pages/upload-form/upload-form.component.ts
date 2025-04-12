import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ButtonComponent} from '../../components/button/button.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, ButtonComponent],
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
  selectedFile: File | null = null;
  invalidFile: boolean = false;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.isPDF(file).then(isPdf => {
        if (isPdf) {
          this.selectedFile = file;
          this.invalidFile = false;
        } else {
          this.invalidFile = true;
          this.selectedFile = null;  // Desmarcar el archivo
          //alert("Por favor, selecciona un archivo PDF.");
        }
      }).catch(() => {
        alert("Ocurrió un error al intentar verificar el archivo.");
      });
    }
  }


  onSubmit(): void {
    if (!this.selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ nsfw: boolean }>('http://localhost:3000/check-nsfw', formData)
      .subscribe({
        next: (res: { nsfw: any; }) => {
          if (res.nsfw) {
            alert('⚠️ El PDF contiene contenido NSFW');
          } else {
            alert('✅ El PDF está limpio');
          }
        },
        error: (err: any) => {
          console.error('Error al analizar el PDF:', err);
          alert('Ocurrió un error al verificar el PDF');
        }
      });
  }

  isPDF(file: File | null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        const header = String.fromCharCode(...arr.slice(0, 5)); // %PDF-
        const isPdf = header === '%PDF-';

        if (!isPdf) {
          console.warn('El archivo seleccionado no es un PDF.');
        }

        resolve(isPdf);
      };

      reader.onerror = function () {
        console.error('Ocurrió un error al leer el archivo.');
        reject(reader.error);
      };

      // @ts-ignore
      reader.readAsArrayBuffer(file.slice(0, 5)); // lee solo los primeros 5 bytes
    });
  }

}
