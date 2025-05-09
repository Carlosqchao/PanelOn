import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {ProfileOptionComponent} from '../../components/profile-option/profile-option.component';
import {UserMetricsComponent} from '../../components/user-metrics/user-metrics.component';
import {AppService} from '../../app.service';
import {Router, RouterLink} from '@angular/router';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {IUser} from '../../models/user';
import {MatDialog} from '@angular/material/dialog';
import {CancelSubscriptionDialogComponent} from '../../components/cancel-subscription-dialog/cancel-subscription-dialog.component';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {User} from '@angular/fire/auth';
import {AuthService} from '../../../../backend/src/services/user-auth';
import {getDownloadURL, ref, Storage, uploadBytes} from '@angular/fire/storage';
import {combineLatest, filter} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonComponent, ProfileOptionComponent, UserMetricsComponent, HeaderBacklinkComponent, NgIf, FormsModule, RouterLink, TranslateModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  userStoreService = inject(UserStoreService);
  userAuthService: AuthService = inject(AuthService);
  storage: Storage = inject(Storage);
  translate: TranslateService = inject(TranslateService);
  user: User | null = null;
  userData: IUser | null = null;
  dialog: MatDialog = inject(MatDialog);
  userDataEdit: Partial<IUser> = {};
  isEditingUsername = false;
  isEditingDescription = false;
  savedComicsCount: number = 0;
  likedComicsCount: number = 0;
  uploadedComicsCount: number = 0;
  isUploading: boolean = false;
  subscriptionStatus: 'active' | 'none' = 'none';

  constructor(private appService: AppService, private router: Router) {}

  callToRead(): void{
    this.router.navigate(['upload-form']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  openModal() {
    this.translate.get([
      'userProfile.modal.title',
      'userProfile.modal.message'
    ]).subscribe(translations => {
      const dialogRef = this.dialog.open(CancelSubscriptionDialogComponent, {
        data: {
          title: translations['userProfile.modal.title'],
          message: translations['userProfile.modal.message'],
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.confirmed) {
          this.appService.updateSubscription(this.user?.uid);
        }
      });
    });
  }


  getSubscription(userId: string) {
    if (!userId) return;

    this.appService.getUserByUid(userId).subscribe(user => {
      if (!user || user.subscription === false) {
        this.subscriptionStatus = 'none';
        console.log(user.subscription);
        return;
      }

      this.subscriptionStatus = 'active';
    }, error => {
      console.error('Error loading subscription:', error);
      this.subscriptionStatus = 'none';
    });
  }

  ngOnInit() {
    const user$ = this.userAuthService.getCurrentUser().pipe(
      filter((user): user is User => !!user)
    );

    const userData$ = this.userStoreService.getUser().pipe(
      filter((data): data is IUser => !!data)
    );

    combineLatest([user$, userData$]).subscribe(([user, userData]) => {
      this.user = user;
      this.userData = userData;
      this.getSubscription(user.uid);

      this.appService.getSavedComicsCount(user.uid).subscribe(count => {
        this.savedComicsCount = count;
      });

      this.appService.getLikedComicsCount(user.uid).subscribe(count => {
        this.likedComicsCount = count;
      });

      this.appService.getUploadedComicsCount(user.uid).subscribe(count => {
        this.uploadedComicsCount = count;
      });
    });
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

  openFileSelector(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.uploadProfileImage(files[0]);
      }
    };
    fileInput.click();
  }

  async uploadProfileImage(file: File): Promise<void> {
    if (!this.user || !this.user.uid) {
      console.error('No user logged in');
      return;
    }
    try {
      this.isUploading = true;
      const storageRef = ref(this.storage, `profile_images/${this.user.uid}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await this.appService.updateUser(this.user.uid, { imageUrl: downloadURL });
      location.reload();
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      this.isUploading = false;
    }
  }

  protected readonly String = String;
}
