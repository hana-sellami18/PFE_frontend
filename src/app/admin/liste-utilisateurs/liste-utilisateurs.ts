import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'RH' | 'Encadrant' | 'Stagiaire';
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

@Component({
  selector: 'app-liste-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './liste-utilisateurs.html',
  styleUrls: ['./liste-utilisateurs.css']
})
export class ListeUtilisateursComponent implements OnInit {

  searchGlobal = '';
  searchTable  = '';
  filtreRole   = 'Tous les rôles';
  showModal    = false;
  showDropdown = false;
  notificationCount = 3;

  rolesOptions = ['Tous les rôles', 'RH', 'Encadrant', 'Stagiaire'];

  newUser = {
    nom: '', prenom: '', email: '',
    role: 'Stagiaire' as 'RH' | 'Encadrant' | 'Stagiaire',
    statut: 'Actif' as 'Actif' | 'Inactif'
  };

  utilisateurs: Utilisateur[] = [
    { id: 1, nom: 'Ben Ali',   prenom: 'Ahmed',  email: 'ahmed.benali@asm.tn',    role: 'RH',        statut: 'Actif',   dateCreation: '01/01/2026' },
    { id: 2, nom: 'Trabelsi',  prenom: 'Fatma',  email: 'fatma.trabelsi@asm.tn',  role: 'Encadrant', statut: 'Actif',   dateCreation: '15/01/2026' },
    { id: 3, nom: 'Sassi',     prenom: 'Mohamed',email: 'mohamed.sassi@asm.tn',   role: 'Encadrant', statut: 'Actif',   dateCreation: '20/01/2026' },
    { id: 4, nom: 'Bouaziz',   prenom: 'Sarra',  email: 'sarra.bouaziz@asm.tn',   role: 'Stagiaire', statut: 'Inactif', dateCreation: '15/02/2026' },
    { id: 5, nom: 'Khelifi',   prenom: 'Ines',   email: 'ines.khelifi@asm.tn',    role: 'Stagiaire', statut: 'Actif',   dateCreation: '01/03/2026' },
    { id: 6, nom: 'Gharbi',    prenom: 'Yassine',email: 'yassine.gharbi@asm.tn',  role: 'RH',        statut: 'Actif',   dateCreation: '10/03/2026' },
    { id: 7, nom: 'Hamdi',     prenom: 'Nour',   email: 'nour.hamdi@asm.tn',      role: 'Stagiaire', statut: 'Actif',   dateCreation: '12/03/2026' },
    { id: 8, nom: 'Mansouri',  prenom: 'Karim',  email: 'karim.mansouri@asm.tn',  role: 'Stagiaire', statut: 'Actif',   dateCreation: '15/03/2026' },
  ];

  // Stats
  get totalUsers()     { return this.utilisateurs.length; }
  get totalRH()        { return this.utilisateurs.filter(u => u.role === 'RH').length; }
  get totalEncadrants(){ return this.utilisateurs.filter(u => u.role === 'Encadrant').length; }
  get totalStagiaires(){ return this.utilisateurs.filter(u => u.role === 'Stagiaire').length; }

  get utilisateursFiltres(): Utilisateur[] {
    return this.utilisateurs.filter(u => {
      const matchRole   = this.filtreRole === 'Tous les rôles' || u.role === this.filtreRole;
      const searchLower = this.searchTable.toLowerCase();
      const matchSearch = !this.searchTable ||
        u.nom.toLowerCase().includes(searchLower) ||
        u.prenom.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower);
      return matchRole && matchSearch;
    });
  }

  selectRole(role: string) {
    this.filtreRole  = role;
    this.showDropdown = false;
  }

  openModal()  { this.showModal = true;  this.resetForm(); }
  closeModal() { this.showModal = false; }

  creerCompte() {
    if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email) return;
    const u: Utilisateur = {
      id:           this.utilisateurs.length + 1,
      nom:          this.newUser.nom,
      prenom:       this.newUser.prenom,
      email:        this.newUser.email,
      role:         this.newUser.role,
      statut:       this.newUser.statut,
      dateCreation: new Date().toLocaleDateString('fr-FR')
    };
    this.utilisateurs.push(u);
    this.closeModal();
  }

  supprimerUtilisateur(id: number) {
    this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
  }

  resetForm() {
    this.newUser = { nom: '', prenom: '', email: '', role: 'Stagiaire', statut: 'Actif' };
  }

  ngOnInit(): void {}
}
