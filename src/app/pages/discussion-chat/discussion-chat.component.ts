import {Component, OnInit} from '@angular/core';
import {CommentsSectionComponent} from '../../components/comments-section/comments-section.component';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {ActivatedRoute} from '@angular/router';
import {Discussion} from '../../models/discussion';
import {Subject, Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {Timestamp} from 'firebase/firestore';

@Component({
  selector: 'app-discussion-chat',
  imports: [
    CommentsSectionComponent,
    HeaderComponent,
    FooterComponent,
    SectionTitleComponent
  ],
  templateUrl: './discussion-chat.component.html',
  styleUrl: './discussion-chat.component.scss'
})
export class DiscussionChatComponent implements OnInit {

  discussion:Discussion = {id:"",discussion:"",userId:"",date:new Timestamp(0,0),title:""};

  private destroy$ = new Subject();
  private subscription: Subscription|undefined;
  currentUserId: string='';
  constructor(private appservice: AppService,
              private route: ActivatedRoute,
              private userStoreService: UserStoreService
  ) {
  }

  ngOnInit() {
    this.subscription = this.userStoreService.getUser().subscribe(user => {
      this.currentUserId = user?.id || '';
    });
    this.appservice.getDiscussionById("discussion1").subscribe(discussion => {
      this.discussion = discussion;
    })
  }



}
