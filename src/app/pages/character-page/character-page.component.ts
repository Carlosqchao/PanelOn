import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class CharacterPageComponent implements OnInit, OnDestroy {
  character: any = {};
  relatedCharacters: any[] = [];
  comics: any[] = [];
  predefinedColors = ['#FFDD33', '#5CAAB4', '#A01F29'];
  private destroy$ = new Subject<void>();
  constructor(
    private appService: AppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      this.appService.getCharacterById(characterId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (character) => {
          if (character) {
            this.character = character;
            if (this.character?.relatedCharacters?.length) {
              this.appService.getRelatedCharacters(this.character.relatedCharacters).pipe(
                takeUntil(this.destroy$)
              ).subscribe({
                next: (related) => {
                  this.relatedCharacters = related;
                },
                error: (err) => {
                  console.error('Error al cargar personajes relacionados:', err);
                }
              });
            }

            // Obtener cómics relacionados
            if (this.character?.relatedComics?.length) {
              this.appService.getRelatedComics(this.character.relatedComics).pipe(
                takeUntil(this.destroy$)
              ).subscribe({
                next: (comics) => {
                  this.comics = comics;
                },
                error: (err) => {
                  console.error('Error al cargar cómics relacionados:', err);
                }
              });
            }
          }
        },
        error: (err) => {
          console.error('Error al cargar el personaje:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
