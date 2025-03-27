import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {InputFieldComponent} from '../../components/input-field/input-field.component';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, InputFieldComponent],
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
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    console.log("Form submitted!");
    console.log("Title:", this.title);
    console.log("Author:", this.author);
    console.log("Synopsis:", this.synopsis);
    console.log("Situation:", this.situation);
    console.log("Selected Genres:", this.selectedGenres);
    console.log("Selected File:", this.selectedFile);
  }
}
