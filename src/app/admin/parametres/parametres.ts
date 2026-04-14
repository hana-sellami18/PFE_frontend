import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Filiere {
  id: number;
  nom: string;
  code: string;
  description: string;
}

interface Cycle {
  id: number;
  nom: string;
  duree: string;
  description: string;
}

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './parametres.html',
  styleUrls: ['./parametres.css']
})
export class Parametres implements OnInit {

  activeTab: 'filieres' | 'cycles' = 'filieres';
  notificationCount = 3;
  searchQuery = '';

  showModalFiliere = false;
  editingFiliere: Filiere | null = null;
  newFiliere = { nom: '', code: '', description: '' };

  showModalCycle = false;
  editingCycle: Cycle | null = null;
  newCycle = { nom: '', duree: '', description: '' };

  filieres: Filiere[] = [
    { id: 1, nom: 'Génie Informatique',  code: 'GI', description: 'Formation en développement logiciel et systèmes informatiques' },
    { id: 2, nom: 'Génie Civil',         code: 'GC', description: 'Formation en conception et construction de bâtiments' },
    { id: 3, nom: 'Génie Électrique',    code: 'GE', description: 'Formation en systèmes électriques et électroniques' },
    { id: 4, nom: 'Génie Mécanique',     code: 'GM', description: 'Formation en conception et fabrication mécanique' },
  ];

  cycles: Cycle[] = [
    { id: 1, nom: 'Licence',               duree: '3 ans', description: 'Premier cycle universitaire'           },
    { id: 2, nom: 'Master',                duree: '2 ans', description: 'Deuxième cycle universitaire'          },
    { id: 3, nom: 'Doctorat',              duree: '3 ans', description: 'Troisième cycle universitaire'         },
    { id: 4, nom: 'Technicien Spécialisé', duree: '2 ans', description: 'Formation professionnelle spécialisée' },
  ];

  openAddFiliere() {
    this.editingFiliere = null;
    this.newFiliere = { nom: '', code: '', description: '' };
    this.showModalFiliere = true;
  }

  openEditFiliere(f: Filiere) {
    this.editingFiliere = f;
    this.newFiliere = { nom: f.nom, code: f.code, description: f.description };
    this.showModalFiliere = true;
  }

  saveFiliere() {
    if (!this.newFiliere.nom || !this.newFiliere.code) return;
    if (this.editingFiliere) {
      const idx = this.filieres.findIndex(f => f.id === this.editingFiliere!.id);
      if (idx !== -1) this.filieres[idx] = { ...this.editingFiliere, ...this.newFiliere };
    } else {
      this.filieres.push({ id: this.filieres.length + 1, ...this.newFiliere });
    }
    this.showModalFiliere = false;
  }

  deleteFiliere(id: number) {
    this.filieres = this.filieres.filter(f => f.id !== id);
  }

  openAddCycle() {
    this.editingCycle = null;
    this.newCycle = { nom: '', duree: '', description: '' };
    this.showModalCycle = true;
  }

  openEditCycle(c: Cycle) {
    this.editingCycle = c;
    this.newCycle = { nom: c.nom, duree: c.duree, description: c.description };
    this.showModalCycle = true;
  }

  saveCycle() {
    if (!this.newCycle.nom || !this.newCycle.duree) return;
    if (this.editingCycle) {
      const idx = this.cycles.findIndex(c => c.id === this.editingCycle!.id);
      if (idx !== -1) this.cycles[idx] = { ...this.editingCycle, ...this.newCycle };
    } else {
      this.cycles.push({ id: this.cycles.length + 1, ...this.newCycle });
    }
    this.showModalCycle = false;
  }

  deleteCycle(id: number) {
    this.cycles = this.cycles.filter(c => c.id !== id);
  }

  ngOnInit(): void {}
}
