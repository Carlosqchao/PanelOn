import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  constructor() {}

  copyPageUrl(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = window.location.href;

        navigator.clipboard.writeText(url)
          .then(() => {
            resolve();
          })
          .catch(err => {
            this.fallbackCopy(url);
            resolve();
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  }
}
