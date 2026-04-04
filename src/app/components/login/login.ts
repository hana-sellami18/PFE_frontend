import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class LoginComponent {
  loginData     = { email: '', password: '' };
  isLoading     = false;
  showPassword  = false;
  emailError    = '';
  passwordError = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.emailError    = '';
    this.passwordError = '';
    let hasError = false;

    if (!this.loginData.email.trim()) {
      this.emailError = "L'email est requis";
      hasError = true;
    } else if (!this.loginData.email.includes('@')) {
      this.emailError = "Email invalide";
      hasError = true;
    }

    if (!this.loginData.password.trim()) {
      this.passwordError = "Le mot de passe est requis";
      hasError = true;
    }

    if (hasError) return;

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('token',      response.token);
        localStorage.setItem('email',      response.email);
        localStorage.setItem('role',       response.role);
        localStorage.setItem('nomComplet', response.nomComplet);
        localStorage.setItem('telephone',  response.telephone  || '');
        localStorage.setItem('userId',     response.id?.toString() || '');

        if (response.role === 'ROLE_RH' || response.role === 'RH') {
          const redirectUrl = localStorage.getItem('redirectUrl') || '/gestion-stages/dashboard';
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          alert('Accès refusé : Cette interface est réservée aux administrateurs RH.');
          localStorage.clear();
        }
      },
      error: () => {
        this.isLoading    = false;
        this.passwordError = 'Email ou mot de passe incorrect.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
