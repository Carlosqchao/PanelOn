import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { CharacterImageComponent } from '../../components/character-image/character-image.component';
import { CharacterTextComponent } from '../../components/character-text/character-text.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-character-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SectionTitleComponent,
    CharacterImageComponent,
    CharacterTextComponent,
    CharacterCardComponent,
    ComicCardComponent
  ],
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss']
})
export class CharacterPageComponent implements OnInit {
  character: any = {};
  relatedCharacters: any[] = [];
  comics: any[] = [];
  predefinedColors = ['#FFDD33', '#5CAAB4', '#A01F29'];

  constructor(
    private appService: AppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      this.appService.getCharacterById(characterId).subscribe({
        next: (character) => {
          if (character) {
            this.character = character;
            this.appService.getCharacters().subscribe({
              next: (allCharacters) => {
                if (this.character?.relatedCharacters?.length) {
                  this.relatedCharacters = allCharacters
                    .filter(c => this.character.relatedCharacters.includes(c.id))
                    .slice(0, 3);
                }
              }
            });
            this.appService.getComics().subscribe({
              next: (allComics) => {
                if (this.character?.relatedComics?.length) {
                  this.comics = allComics
                    .filter(comic => this.character.relatedComics.includes(comic.id))
                    .slice(0, 4);
                }
              }
            });
          }
        }
      });
    }
  }
}
