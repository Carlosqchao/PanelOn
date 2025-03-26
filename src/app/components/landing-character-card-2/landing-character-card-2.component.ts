import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-character-card-2',
  templateUrl: './landing-character-card-2.component.html',
  standalone: true,
  styleUrls: ['./landing-character-card-2.component.scss']
})
export class LandingCharacterCard2Component {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Character image';
  @Input() backgroundColor: string = '#5CAAB4';
  @Input() brandName: string = 'MARVEL';
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
