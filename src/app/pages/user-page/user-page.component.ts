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

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonComponent, ProfileOptionComponent, UserMetricsComponent, HeaderBacklinkComponent, NgIf, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {
  user: null|IUser = null;
  dialog: MatDialog = inject(MatDialog);
  isEditingUsername = false;
  newUsername = '';

  userStoreService = inject(UserStoreService);
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
    this.user = this.userStoreService.getUser()
  }

  toggleUsernameEdit(): void {
    this.isEditingUsername = !this.isEditingUsername;
    if (this.isEditingUsername && this.user) {
      this.newUsername = this.user.username;
    }
  }

  saveUsername(): void {
    if (this.user && this.newUsername.trim() !== '') {
      this.user.username = this.newUsername.trim();

      // Aquí deberías llamar al servicio para actualizar el nombre en la base de datos
      // this.userStoreService.updateUsername(this.user.id, this.newUsername);

      // Actualiza el usuario en el store
      this.userStoreService.setUser(this.user);
    }
    this.isEditingUsername = false;
  }

  cancelEdit(): void {
    this.isEditingUsername = false;
  }
}
