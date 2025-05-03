import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AppService } from '../../app.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import {Comic} from '../../models/comic';

@Component({
  selector: 'app-edit-comic-page',
  imports: [
    ButtonComponent,
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './edit-comic-page.component.html',
  styleUrl: './edit-comic-page.component.scss'
})
export class EditComicPageComponent implements OnInit {
  comicId: string | null = null;
  title = '';
  author = '';
  synopsis = '';
  state = '';
  selectedGenres: string[] = [];
  selectedGenre = '';
  stateOptions: string[] = ['In process', 'Finished'];
  genre: string[] = [];
  formSubmitted = false;
  updateSuccess = false;
  updateError = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.comicId = this.route.snapshot.paramMap.get('id');
    this.loadComicData();
    this.appService.getGenres().subscribe(result => {
      this.genre = result.map(genre => genre.name);
    });
  }

  async loadComicData() {
    if (this.comicId) {
      const comicDoc = doc(this.firestore, `/comics/${this.comicId}`);
      const comicSnapshot = await getDoc(comicDoc);
      if (comicSnapshot.exists()) {
        const comicData = comicSnapshot.data();
        this.title = comicData['title'] || '';
        this.author = comicData['author'] || '';
        this.synopsis = comicData['synopsis'] || '';
        this.state = comicData['state'] || '';
        this.selectedGenres = comicData['genre'] || [];
      } else {
        console.error('Comic not found');
      }
    }
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

  removeGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index !== -1) {
      this.selectedGenres.splice(index, 1);
    }
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.formSubmitted = true;
    this.updateSuccess = false;
    this.updateError = false;

    const isFormValid =
      this.isValidTitle() &&
      this.isValidAuthor() &&
      this.state !== '' &&
      this.selectedGenres.length > 0;

    if (isFormValid && this.comicId) {
      const updatedComic: Partial<Comic> = {
        title: this.title,
        author: this.author,
        synopsis: this.synopsis,
        state: this.state,
        genre: this.selectedGenres
      };

      try {
        await this.appService.updateComic(this.comicId, updatedComic);
        this.updateSuccess = true;
        form.resetForm();
        this.resetState();
      } catch (error) {
        this.updateError = true;
        console.error('Error updating comic:', error);
      }
    }
  }

  resetState(): void {
    this.title = '';
    this.author = '';
    this.synopsis = '';
    this.state = '';
    this.selectedGenres = [];
    this.selectedGenre = '';
    this.formSubmitted = false;
  }

  isValidTitle(): boolean {
    return /^[\p{L}\p{N}\p{P}\p{S}\s]{1,50}$/u.test(this.title);
  }

  isValidAuthor(): boolean {
    return /^[\p{L}\p{N}][\p{L}\p{N} .,:;!¡¿?\-']{0,48}[\p{L}\p{N}]$/u.test(this.author);
  }
}
