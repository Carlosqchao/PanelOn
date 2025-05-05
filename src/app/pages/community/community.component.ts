import {Component, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {DiscussionCardComponent} from '../../components/discussion-card/discussion-card.component';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {Discussion} from '../../models/discussion';
import {AppService} from '../../app.service';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {ButtonComponent} from '../../components/button/button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserStoreService} from '../../../../backend/src/services/user-store';

@Component({
  selector: 'app-community',
  imports: [
    HeaderComponent,
    SearchBarComponent,
    FooterComponent,
    DiscussionCardComponent,
    SectionTitleComponent,
    SlicePipe,
    NgForOf,
    NgIf,
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})

export class CommunityComponent implements OnInit {
  discussions: Discussion[]=[];
  private destroy$=new Subject<void>();
  showDiscussionForm:boolean=false;
  newDiscussionContent:string="";
  newDiscussionTitle:string='';
  @Input() currentUserId:string='';
  private subscription:Subscription|undefined;

  constructor(private appService: AppService,
              private userStoreService: UserStoreService,
  ) {}

  ngOnInit() {
    this.subscription = this.userStoreService.getUser().subscribe(user => {
      this.currentUserId = user?.id || '';
    });
    this.appService.getDiscussions().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (discussions) => {
        this.discussions = discussions;
      },
      error: (err) => {
        console.error('Error al cargar los cómics desde Firestore:', err);
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDiscussionForm() {
    this.showDiscussionForm = !this.showDiscussionForm;
    if (!this.showDiscussionForm) {
      this.newDiscussionContent = '';
    }
  }

  addDiscussion() {

    const newDiscussion :Omit<Discussion, 'id'|'date'> ={
      userId:this.currentUserId,
      title:this.newDiscussionTitle,
      discussion:this.newDiscussionContent,
    }
    this.appService.addDiscussion(newDiscussion);

  }
}
