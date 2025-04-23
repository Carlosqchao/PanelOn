import {Component, inject} from '@angular/core';
import {ButtonComponent} from '../../components/button/button.component';
import {ProfileOptionComponent} from '../../components/profile-option/profile-option.component';
import {UserInfoComponent} from '../../components/user-info/user-info.component';
import {UserMetricsComponent} from '../../components/user-metrics/user-metrics.component';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {HeaderBacklinkComponent} from '../../components/header-backlink/header-backlink.component';
import {UserStoreService} from '../../../../backend/src/services/user-store';
import {IUser} from '../../models/user';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonComponent, ProfileOptionComponent, UserInfoComponent, UserMetricsComponent, HeaderBacklinkComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  user: null|IUser  = null;
  userStoreService = inject(UserStoreService);
  constructor(private appService: AppService, private router: Router) {}
  callToRead(): void{
    this.router.navigate(['upload-form']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.user = this.userStoreService.getUser();
  }
}
