import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app';
import { LoginComponent } from './components/login/login';
import { Register } from './components/register/register';
import { GestionStagesComponent } from './gestion-stages/gestion-stages';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar';
import { ListeUtilisateursComponent } from './admin/liste-utilisateurs/liste-utilisateurs';
import { Parametres } from './admin/parametres/parametres';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Register
    // ✅ tous les standalone retirés de declarations
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    GestionStagesComponent,
    AdminDashboardComponent,      // ✅ standalone
    AdminSidebarComponent,        // ✅ standalone
    ListeUtilisateursComponent,   // ✅ standalone
    Parametres,          // ✅ standalone — nom corrigé
    AdminProfileComponent,        // ✅ standalone — nom corrigé
    RouterModule.forRoot([
      { path: 'login',    component: LoginComponent },
      { path: 'register', component: Register },

      // ─── ESPACE RH ─────────────────────────────────────
      {
        path: 'gestion-stages',
        component: GestionStagesComponent,
        children: [
          { path: 'dashboard',    component: GestionStagesComponent },
          { path: 'offres',       component: GestionStagesComponent },
          { path: 'candidatures', component: GestionStagesComponent },
          { path: 'stagiaires',   component: GestionStagesComponent },
          { path: 'encadrants',   component: GestionStagesComponent },
          { path: 'evaluations',  component: GestionStagesComponent },
          { path: 'archives',     component: GestionStagesComponent },
          { path: 'parametres',   component: GestionStagesComponent },
          { path: 'profil',       component: GestionStagesComponent },
          { path: 'offre-form',   component: GestionStagesComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },

      // ─── ESPACE ADMIN ───────────────────────────────────
      {
        path: 'admin',
        children: [
          { path: 'dashboard',    component: AdminDashboardComponent    },
          { path: 'utilisateurs', component: ListeUtilisateursComponent },
          { path: 'parametres',   component: Parametres        },
          { path: 'profil',       component: AdminProfileComponent      },
          // { path: 'demandes', component: DemandesAccesComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },

      { path: '',   redirectTo: '/login', pathMatch: 'full' },
      { path: '**', redirectTo: '/login' }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
