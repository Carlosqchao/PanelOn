// character-card.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  standalone: true,
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input() imageUrl: string = '';
  @Input() superheroName: string = '';
  @Input() characterName: string = '';
  @Input() characterId: string = '';

  constructor(private router: Router) {}

  onCardClick(): void {
    if (this.characterId) {
      this.router.navigate(['character', this.characterId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
}
