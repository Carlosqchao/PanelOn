import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {DiscussionCardComponent} from '../../components/discussion-card/discussion-card.component';

@Component({
  selector: 'app-community',
  imports: [
    HeaderComponent,
    SearchBarComponent,
    FooterComponent,
    DiscussionCardComponent
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent {

}
