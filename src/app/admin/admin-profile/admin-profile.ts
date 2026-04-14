import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {

  notificationCount = 3;
  activeSection: 'info' | 'password' = 'info';
  successMessage = '';
  errorMessage = '';

  profile = {
    nom: 'Administrateur',
    prenom: 'ASM',
    email: 'admin@asm.com',
    telephone: '+216 71 000 000',
    poste: 'Administrateur Système',
    dateCreation: '01/01/2026',
    derniereConnexion: '13/04/2026 à 09:30',
  };

  editProfile = { ...this.profile };

  passwordForm = {
    ancien: '',
    nouveau: '',
    confirmer: ''
  };

  showAncien    = false;
  showNouveau   = false;
  showConfirmer = false;

  activiteRecente = [
    { action: 'Compte créé',     utilisateur: 'Ahmed Ben Ali',  date: '10/04/2026', type: 'create' },
    { action: 'Compte modifié',  utilisateur: 'Fatma Trabelsi', date: '09/04/2026', type: 'edit'   },
    { action: 'Compte supprimé', utilisateur: 'Mohamed Sassi',  date: '08/04/2026', type: 'delete' },
    { action: 'Compte créé',     utilisateur: 'Sarra Bouaziz',  date: '07/04/2026', type: 'create' },
    { action: 'Connexion',       utilisateur: 'admin@asm.com',  date: '06/04/2026', type: 'login'  },
  ];

  stats = {
    comptesCreees:      12,   // ✅ sans accent
    utilisateursActifs: 8,
    derniereAction:     '13/04/2026',
  };

  saveProfile() {
    this.profile = { ...this.editProfile };
    this.successMessage = 'Profil mis à jour avec succès.';
    setTimeout(() => this.successMessage = '', 3000);
  }

  savePassword() {
    if (!this.passwordForm.ancien || !this.passwordForm.nouveau || !this.passwordForm.confirmer) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    if (this.passwordForm.nouveau !== this.passwordForm.confirmer) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    if (this.passwordForm.nouveau.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.passwordForm = { ancien: '', nouveau: '', confirmer: '' };
    this.successMessage = 'Mot de passe modifié avec succès.';
    setTimeout(() => this.successMessage = '', 3000);
  }

  getInitiales(): string {
    return (this.profile.prenom[0] + this.profile.nom[0]).toUpperCase();
  }

  ngOnInit(): void {
    this.editProfile = { ...this.profile };
  }
}
