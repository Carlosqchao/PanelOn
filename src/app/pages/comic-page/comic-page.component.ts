import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {ComicCoverComponent} from '../../components/comic-cover/comic-cover.component';
import {ComicDescriptionComponent} from '../../components/comic-description/comic-description.component';
import {CharacterCardComponent} from '../../components/character-card/character-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-comic-page',
  imports: [
    HeaderComponent,
    ComicCoverComponent,
    ComicDescriptionComponent,
    CharacterCardComponent,
    NgForOf
  ],
  templateUrl: './comic-page.component.html',
  styleUrl: './comic-page.component.scss'
})
export class ComicPageComponent {
  title: string = "SUPERMAN'S GIRLFRIEND LOIS LANE";
  synopsis: string = "Lois Lane, the fearless and ambitious journalist of the Daily Planet, finds herself in thrilling adventures as she navigates her professional career and her complex relationship with Superman. From uncovering shocking stories to getting caught in bizarre situations, Lois proves she’s much more than just Superman’s love interest—she’s a hero in her own right. With twists, romance, and action-packed drama, this classic series captures the golden age of superhero storytelling.";
  author: string = "DC Comics";
  genre: string = "Superhero, Romance, Adventure";
  releaseDate: string = "March 1958";

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
