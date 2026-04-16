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
import { AdminTopbarComponent } from './admin/admin-topbar/admin-topbar';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { ListeUtilisateursComponent } from './admin/liste-utilisateurs/liste-utilisateurs';
import { Parametres } from './admin/parametres/parametres';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Register
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    GestionStagesComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    AdminLayoutComponent,
    ListeUtilisateursComponent,
    Parametres,
    AdminProfileComponent,
    RouterModule.forRoot([
      { path: 'login',    component: LoginComponent },
      { path: 'register', component: Register },

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

      {
        path: 'admin',
        component: AdminLayoutComponent,   // ← layout parent
        children: [
          { path: 'dashboard',    component: AdminDashboardComponent    },
          { path: 'utilisateurs', component: ListeUtilisateursComponent },
          { path: 'parametres',   component: Parametres                 },
          { path: 'profil',       component: AdminProfileComponent      },
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
