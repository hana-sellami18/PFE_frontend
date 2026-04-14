import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',       // ✅ corrigé
  styleUrls: ['./admin-sidebar.css']         // ✅ corrigé
})
export class AdminSidebarComponent {

  isCollapsed = false;

  menuItems = [
    { label: 'Tableau de bord',  route: '/admin/dashboard',    icon: 'grid'     },
    { label: 'Utilisateurs',     route: '/admin/utilisateurs', icon: 'users'    },
    { label: 'Paramètres',       route: '/admin/parametres',   icon: 'settings' },
    { label: "Demandes d'accès", route: '/admin/demandes',     icon: 'file'     }
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
