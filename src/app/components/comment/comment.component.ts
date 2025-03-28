import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() userIcon: string = '';
  @Input() username: string = '';
  @Input() comment: string = '';
}
