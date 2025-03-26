import { Component } from '@angular/core';
import {CharacterImageComponent} from '../../components/character-image/character-image.component';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {CharacterTextComponent} from '../../components/character-text/character-text.component';
import {CharacterCardComponent} from '../../components/character-card/character-card.component';
import {NgForOf} from '@angular/common';
import {ComicCardComponent} from '../../components/comic-card/comic-card.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-character-page',
  imports: [
    CharacterImageComponent,
    SectionTitleComponent,
    CharacterTextComponent,
    CharacterCardComponent,
    NgForOf,
    ComicCardComponent,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './character-page.component.html',
  standalone: true,
  styleUrl: './character-page.component.scss'
})
export class CharacterPageComponent {
  characters = [
    {
      imageUrl: 'https://cdn.marvel.com/content/1x/005smp_com_crd_01.jpg',
      superheroName: 'Spider-Man',
      characterName: 'Peter Parker'
    },
    {
      imageUrl: 'https://cdn.marvel.com/content/1x/032kgp_com_crd_01.jpg',
      superheroName: 'KingPin',
      characterName: 'Wilson Fisk'
    },
    {
      imageUrl: 'https://cdn.marvel.com/content/1x/002irm_com_crd_01.jpg',
      superheroName: 'Iron Man',
      characterName: 'Tony Stark'
    },
    {
      imageUrl: 'https://cdn.marvel.com/content/1x/003cap_com_crd_01.jpg',
      superheroName: 'Captain America',
      characterName: 'Steve Rogers'
    }
  ];

  comics = [
    { title: 'Spider-Man', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/3/30/6750d4c18340e/portrait_uncanny.jpg' },
    { title: 'Avengers', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/6750d4ca9eff7/portrait_uncanny.jpg' },
    { title: 'Spider-Man 2', imageUrl: 'https://cdn.marvel.com/u/prod/marvel/i/mg/9/80/645577dc06dca/portrait_uncanny.jpg' },
  ];
}

