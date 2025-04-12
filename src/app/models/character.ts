export interface Character {
  characterName: string;
  description: string;
  id: number;
  image: string;
  relatedCharacters: number[];
  relatedComics: number[];
}
