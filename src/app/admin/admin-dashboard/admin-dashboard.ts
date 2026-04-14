import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar'; // ✅ corrigé

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  trend?: string;
}

interface MonthData {
  month: string;
  enCours: number;
  termines: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  searchQuery: string = '';
  notificationCount: number = 3;
  currentYear: number = new Date().getFullYear();

  statCards: StatCard[] = [
    { title: 'Utilisateurs RH',         value: 12,  subtitle: '+2 ce mois',     icon: 'rh',        trend: 'up'      },
    { title: 'Encadrants',              value: 28,  subtitle: '+5 ce mois',     icon: 'encadrant', trend: 'up'      },
    { title: 'Stagiaires',              value: 156, subtitle: '+23 ce mois',    icon: 'stagiaire', trend: 'up'      },
    { title: 'Stages en cours',         value: 45,  subtitle: 'En progression', icon: 'stage',     trend: 'neutral' },
    { title: 'Stages terminés',         value: 89,  subtitle: '+12 ce mois',    icon: 'check',     trend: 'up'      },
    { title: 'Candidatures en attente', value: 34,  subtitle: 'À traiter',      icon: 'clock',     trend: 'warning' },
  ];

  monthlyData: MonthData[] = [
    { month: 'Jan',  enCours: 12, termines: 8  },
    { month: 'Fév',  enCours: 15, termines: 10 },
    { month: 'Mar',  enCours: 17, termines: 14 },
    { month: 'Avr',  enCours: 22, termines: 14 },
    { month: 'Mai',  enCours: 20, termines: 16 },
    { month: 'Juin', enCours: 26, termines: 22 },
  ];

  roleStats = {
    rh:         { count: 12,  percent: 6,  color: '#E8A040' },
    encadrants: { count: 28,  percent: 14, color: '#1e2530' },
    stagiaires: { count: 156, percent: 80, color: '#c97a20' },
  };

  get barMax(): number {
    return Math.max(...this.monthlyData.map(d => Math.max(d.enCours, d.termines)));
  }

  barHeight(value: number): number {
    return Math.round((value / this.barMax) * 160);
  }

  get donutSegments() {
    const total = this.roleStats.rh.count + this.roleStats.encadrants.count + this.roleStats.stagiaires.count;
    const circumference = 2 * Math.PI * 70;
    const gap = 3;

    const data = [
      { label: 'RH',         count: this.roleStats.rh.count,         color: this.roleStats.rh.color         },
      { label: 'Encadrants', count: this.roleStats.encadrants.count, color: this.roleStats.encadrants.color },
      { label: 'Stagiaires', count: this.roleStats.stagiaires.count, color: this.roleStats.stagiaires.color },
    ];

    let offset = 0;
    return data.map(d => {
      const pct = d.count / total;
      const dashLen = pct * circumference - gap;
      const seg = {
        ...d,
        dashArray: `${dashLen} ${circumference - dashLen}`,
        dashOffset: -offset,
        pct: Math.round(pct * 100)
      };
      offset += pct * circumference;
      return seg;
    });
  }

  ngOnInit(): void {}

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }
}
