import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComicDownloadService {
  private storage = getStorage();

  constructor() {}

  downloadComic(comicFilePath: string): Observable<string> {
    const fileRef = ref(this.storage, `uploads/${comicFilePath}`);
    return from(getDownloadURL(fileRef));
  }
}
