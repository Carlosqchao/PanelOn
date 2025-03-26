import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ButtonComponent, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  imageSource: string = 'https://imgix.bustle.com/uploads/image/2022/7/23/f33a5352-e7ad-4d17-9b73-b364ba445391-clean2.jpeg';
  logoSource: string = '';

  username: string = '';
  password: string = '';

  errorMessage: string = '';
  formSubmitted: boolean = false;

  passwordVisible: boolean = false;
  eyeOpenIcon: string = '/closed-eye.jpg';
  eyeClosedIcon: string = '/open-eye.jpg';

  @ViewChild('loginForm') loginForm!: NgForm;

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.loginForm.valid) {
      return;
    }

    console.log('Login submitted:', {
      username: this.username,
      password: this.password
    });

    this.loginForm.resetForm();
    this.formSubmitted = false;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  getErrorMessage(control: any, messages: { [key: string]: string }): string {
    if (control.errors) {
      for (const errorKey in control.errors) {
        if (control.errors[errorKey] && messages[errorKey]) {
          return messages[errorKey];
        }
      }
    }
    return '';
  }
}
