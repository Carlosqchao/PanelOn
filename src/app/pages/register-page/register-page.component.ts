import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../../backend/src/services/user-auth';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ButtonComponent, FormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  imageSource: string = 'https://1.bp.blogspot.com/-j7pelIBKTn0/XacCFsSjsII/AAAAAAAAf_Y/rvpqFruHKj8Hym6PS7n7P0V3J3nmHvs5wCLcBGAsYHQ/s1600/05.jpg';
  logoSource: string = '/favicon.ico';

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  formSubmitted: boolean = false;

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  eyeOpenIcon: string = '/closed-eye.jpg';
  eyeClosedIcon: string = '/open-eye.jpg';

  @ViewChild('registerForm') registerForm!: NgForm;

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (!this.registerForm.valid) {
      this.errorMessage = 'Invalid form. Please fill all the fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    console.log('Form submitted:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password
    });

    const formValues = this.registerForm.value;
    this.authService
      .register(
        formValues.email,
        formValues.username,
        formValues['first-name'],
        formValues['last-name'],
        formValues.password
    ).subscribe({
      next: () => {
        console.log('Registro exitoso, redirigiendo...');
        this.router.navigateByUrl('');
      },
      error: (err) => {
        console.error('Error completo:', err);
        if (err.code) {
          switch (err.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = 'The email is already registered. Please use another email or log in.';
              break;
            case 'auth/invalid-email':
              this.errorMessage = 'The email is not valid. Please check the format.';
              break;
            case 'auth/weak-password':
              this.errorMessage = 'The password is too weak. It must be at least 6 characters long.';
              break;
            case 'auth/operation-not-allowed':
              this.errorMessage = 'Registration with email and password is not enabled. Contact the administrator.';
              break;
            default:
              this.errorMessage = `Error during registration: ${err.message}`;
              break;
          }
        } else {
          this.errorMessage = `Unexpected error: ${err.message}`;
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    confirmPasswordInput.type = this.confirmPasswordVisible ? 'text' : 'password';
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
