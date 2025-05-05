import {Component, Input} from '@angular/core';
import {Discussion} from '../../models/discussion';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Timestamp} from 'firebase/firestore';

@Component({
  selector: 'app-discussion-card',
  templateUrl: './discussion-card.component.html',
  imports: [
    DatePipe
  ],
  styleUrl: './discussion-card.component.scss'
})
export class DiscussionCardComponent{
  @Input() discussion: Discussion = {id:"",discussion:"",userId:"",date:new Timestamp(0,0),title:""};
  date?:string;

  constructor(private router: Router) {}


  onSeeMore() {
    if(this.discussion?.id){
      this.router.navigate(['discussion',this.discussion.id]).then(() =>{
        window.scrollTo(0,0);
      });
    }
  }


}
