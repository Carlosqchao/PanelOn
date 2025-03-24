import { Component } from '@angular/core';
import {CharacterImageComponent} from '../../components/character-image/character-image.component';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {CharacterTextComponent} from '../../components/character-text/character-text.component';
import {CharacterCardComponent} from '../../components/character-card/character-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-character-page',
  imports: [
    CharacterImageComponent,
    SectionTitleComponent,
    CharacterTextComponent,
    CharacterCardComponent,
    NgForOf
  ],
  templateUrl: './character-page.component.html',
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
}

