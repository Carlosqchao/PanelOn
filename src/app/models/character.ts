export interface Character {
  id: number;
  characterName: string;
  description: string;
  image: string;
  relatedCharacters: number[];
  relatedComics: number[];
}
