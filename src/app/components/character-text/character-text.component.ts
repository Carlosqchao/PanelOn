import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-text',
  templateUrl: './character-text.component.html',
  standalone: true,
  styleUrls: ['./character-text.component.scss']
})
export class CharacterTextComponent {
  @Input() historyText: string = '';
}
