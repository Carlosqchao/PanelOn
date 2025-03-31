import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-character-card-1',
  templateUrl: './landing-character-card-1.component.html',
  standalone: true,
  styleUrls: ['./landing-character-card-1.component.scss']
})
export class LandingCharacterCard1Component {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() backgroundColor: string = '';
  @Input() brandName: string = '';
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
