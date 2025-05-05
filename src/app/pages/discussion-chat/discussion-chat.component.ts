import {Component, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {ActivatedRoute} from '@angular/router';
import {Discussion} from '../../models/discussion';
import {Subject, Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {ChatComponent} from '../../components/chat/chat.component';

@Component({
  selector: 'app-discussion-chat',
  imports: [
    HeaderComponent,
    SectionTitleComponent,
    ChatComponent
  ],
  templateUrl: './discussion-chat.component.html',
  styleUrl: './discussion-chat.component.scss'
})
export class DiscussionChatComponent implements OnInit {

  discussion!:Discussion;

  private destroy$ = new Subject();
  private subscription: Subscription|undefined;
  currentUserId: string='';
  constructor(private appservice: AppService,
              private route: ActivatedRoute,
              private userStoreService: UserStoreService
  ) {
  }

  ngOnInit() {

    const discussionId = this.route.snapshot.params['id'];
    this.appservice.getDiscussionById(discussionId).subscribe(discussion => {
      this.discussion = discussion;
    })
    this.subscription = this.userStoreService.getUser().subscribe(user => {
      this.currentUserId = user?.id || '';
    });

  }



}
