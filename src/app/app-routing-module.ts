import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { Register } from './components/register/register';
import { GestionStagesComponent } from './gestion-stages/gestion-stages';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: Register },

  // ─── ESPACE RH ───────────────────────────────────────────
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

  // ─── ESPACE ADMIN ─────────────────────────────────────────
  {
    path: 'admin',
    children: [
      { path: 'dashboard',         component: AdminDashboardComponent },
      // { path: 'utilisateurs',   component: ListeUtilisateursComponent },   // à décommenter plus tard
      // { path: 'creer-compte',   component: CreerCompteComponent },         // à décommenter plus tard
      // { path: 'parametres',     component: ParametresComponent },          // à décommenter plus tard
      // { path: 'demandes-acces', component: DemandesAccesComponent },       // à décommenter plus tard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ─── REDIRECTIONS ─────────────────────────────────────────
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
