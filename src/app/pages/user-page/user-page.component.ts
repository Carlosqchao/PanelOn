import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {ProfileOptionComponent} from '../../components/profile-option/profile-option.component';
import {UserMetricsComponent} from '../../components/user-metrics/user-metrics.component';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {IUser} from '../../models/user';
import {MatDialog} from '@angular/material/dialog';
import {CancelSubscriptionDialogComponent} from '../../components/cancel-subscription-dialog/cancel-subscription-dialog.component';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {User} from '@angular/fire/auth';
import {AuthService} from '../../../../backend/src/services/user-auth';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonComponent, ProfileOptionComponent, UserMetricsComponent, HeaderBacklinkComponent, NgIf, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  userStoreService = inject(UserStoreService);
  userAuthService: AuthService = inject(AuthService);
  user: User | null = null;
  userData: IUser | null = null;
  dialog: MatDialog = inject(MatDialog);
  userDataEdit: Partial<IUser> = {};
  isEditingUsername = false;
  isEditingDescription = false;


  constructor(private appService: AppService, private router: Router) {}

  callToRead(): void{
    this.router.navigate(['upload-form']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  openModal() {
    this.dialog.open(CancelSubscriptionDialogComponent, {
      data: {
        title: 'YOU ARE GOING TO CANCEL YOUR SUBSCRIPTION',
        message: 'ARE YOU SURE OF WHAT ARE YOU DOING?',
      }
    })
  }

  ngOnInit() {
    this.userAuthService.getCurrentUser().subscribe(user => this.user = user);
    this.userStoreService.getUser().subscribe(userData => this.userData = userData);
  }

  toggleUsernameEdit(): void {
    this.isEditingUsername = !this.isEditingUsername;
    if (this.isEditingUsername && this.userData) {
      this.userDataEdit = {...this.userData};
    }
  }

  toggleDescriptionEdit(): void {
    this.isEditingDescription = !this.isEditingDescription;
    if (this.isEditingDescription && this.userData) {
      this.userDataEdit = {...this.userData};
      if (!this.userDataEdit.description) {
        this.userDataEdit.description = '';
      }
    }
  }

  async saveUsername(){
    await this.appService.updateUser(this.user?.uid, this.userDataEdit);
    this.cancelEdit();
    location.reload();
  }

  async saveDescription(){
    await this.appService.updateUser(this.user?.uid, this.userDataEdit);
    this.cancelEdit();
    location.reload();
  }

  cancelEdit(): void {
    this.isEditingUsername = false;
    this.isEditingDescription = false;
    this.userDataEdit = {};
  }

  hasDescription(): boolean {
    return !!this.userData?.description && this.userData.description.trim() !== '';
  }
}
