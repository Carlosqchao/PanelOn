import {Component, Input} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-article-page',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './article-page.component.html',
  standalone: true,
  styleUrl: './article-page.component.scss'
})
export class ArticlePageComponent {
  @Input() title: string = 'Composer Laura Karpman Used Wind-Up Toys and a Vintage Radio to Score ‘Captain America: Brave New World’';
  @Input() author: string = 'Devan Coggan';
  @Input() imgSrc: string = 'assets/article-picture.png';
  @Input() articleContent: string = 'Composer Laura Karpman has shaped some of the most memorable sounds of the Marvel Cinematic Universe. The five-time Emmy Award winner and Oscar nominee has crafted themes for many of Marvel’s most beloved heroes, writing scores for the 2023 film The Marvels and the Disney+ series What If…? and Ms. Marvel.\n' +
    '\n' +
    'Now, Karpman is diving back into the music of the MCU, taking flight with Sam Wilson for Marvel Studios’ Captain America: Brave New World.\n' +
    'The film follows Anthony Mackie’s high-flying hero as he’s tangled in an international incident, clashing with the newly-elected President Thaddeus “Thunderbolt” Ross (Harrison Ford). The entire film has a ticking-clock quality, as Sam races to uncover a deadly conspiracy — something Karpman and director Julius Onah wanted to emphasize through music.\n' +
    '\n' +
    '“We wanted to find an edgy sound for Cap,” Karpman tells Marvel.com. “He is a modern man in a modern situation. We wanted to create music for who he is at this second, at this moment in his life.”\n' +
    '\n' +
    'Captain America: Brave New World is an action-packed Super Hero story, but Onah also wanted to keep the film as grounded as possible, describing it as “our own version of a paranoid thriller.” To capture that vibe musically, he and Karpman assembled a wide range of sonic inspirations — from 1970s conspiracy classics to more modern spy flicks. ';
}
