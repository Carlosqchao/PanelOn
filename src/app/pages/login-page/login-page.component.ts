import { Component, inject, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../backend/src/services/user-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ButtonComponent, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  imageSource: string = 'https://imgix.bustle.com/uploads/image/2022/7/23/f33a5352-e7ad-4d17-9b73-b364ba445391-clean2.jpeg';
  logoSource: string = '/favicon.ico';

  email: string = '';
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
      email: this.email,
      password: this.password
    });

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login successful');
        this.loginForm.resetForm();
        this.formSubmitted = false;
        this.router.navigateByUrl('');
      },
      error: (err: any) => {
        console.error('Error during login:', err);
        this.handleLoginError(err);
      }
    });
  }

  private handleLoginError(err: any) {
    if (err.code) {
      switch (err.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'No user found with this email. Please register.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'auth/invalid-credential':
          this.errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          this.errorMessage = `Error during login: ${err.message}`;
          break;
      }
    } else {
      this.errorMessage = `Unexpected error: ${err.message || 'An unknown error occurred'}`;
    }
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
