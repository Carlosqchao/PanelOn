import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, FormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  imageSource: string = 'https://1.bp.blogspot.com/-j7pelIBKTn0/XacCFsSjsII/AAAAAAAAf_Y/rvpqFruHKj8Hym6PS7n7P0V3J3nmHvs5wCLcBGAsYHQ/s1600/05.jpg';
  logoSource: string = '/PanelOnLogo.png';

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

    this.registerForm.resetForm();
    this.formSubmitted = false;
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
