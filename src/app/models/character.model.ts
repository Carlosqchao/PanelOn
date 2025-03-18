export interface Character {
  id: number;
  name: string;
  characterImage: string;
  baseHistory: string;
  relatedCharacters: number[];
  comics: number[];
}
