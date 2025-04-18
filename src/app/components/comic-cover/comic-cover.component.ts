import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comic-cover',
  templateUrl: './comic-cover.component.html',
  imports: [
  ],
  standalone: true,
  styleUrls: ['./comic-cover.component.scss']
})
export class ComicCoverComponent {
  @Input() comicCoverUrl: string = 'https://img.gocollect.com/eyJidWNrZXQiOiJnb2NvbGxlY3QuaW1hZ2VzLnB1YiIsImtleSI6IjBjZGZmOTYxLWEyNDUtNGM5MC1hMzA5LTdiMmI2MDlhODg3Zi5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjMwMH19fQ==';
}
