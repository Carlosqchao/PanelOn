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
  successMessage: string = '';
  formSubmitted: boolean = false;
  isResetPasswordMode: boolean = false;

  passwordVisible: boolean = false;
  eyeOpenIcon: string = '/closed-eye.jpg';
  eyeClosedIcon: string = '/open-eye.jpg';

  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild('emailInput') emailInput!: NgForm;
  @ViewChild('passwordInput') passwordInput!: NgForm;

  onSubmit() {
    this.isResetPasswordMode = false;
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginForm.valid) {
      return;
    }

    console.log('Login submitted:', { email: this.email, password: this.password });

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

  resetPassword(event: Event) {
    event.preventDefault();
    this.isResetPasswordMode = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.formSubmitted = true;

    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    this.authService.sendPasswordResetEmail(this.email).subscribe({
      next: () => {
        this.successMessage = 'A password reset email has been sent. Check your inbox.';
        this.formSubmitted = false;
      },
      error: (err: any) => {
        this.handleResetPasswordError(err);
      }
    });
  }

  private handleLoginError(err: any) {
    if (err.code) {
      switch (err.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'No user found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Invalid email or password. Try again.';
          break;
        case 'auth/invalid-credential':
          this.errorMessage = 'Invalid email or password. Try again.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many attempts. Try again later.';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'Network error. Check your connection and try again.';
          break;
        default:
          this.errorMessage = `Login error: ${err.message}`;
          break;
      }
    } else {
      this.errorMessage = `Unexpected error: ${err.message || 'An unknown error occurred'}`;
    }
  }

  private handleResetPasswordError(err: any) {
    if (err.code) {
      switch (err.code) {
        case 'auth/invalid-email':
          this.errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'No account found with this email.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many requests. Try again later.';
          break;
        case 'auth/network-request-failed':
          this.errorMessage = 'Network error. Check your connection and try again.';
          break;
        default:
          this.errorMessage = `Error sending email: ${err.message}`;
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
