import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { OffreStage } from '../shared/offre-stage.model';
import { SidebarComponent } from '../sidebar/sidebar';
import { DashboardComponent, Candidature } from '../dashboard/dashboard';
import { OffresListComponent } from '../offres-list/offres-list';
import { OffreFormComponent } from '../offre-form/offre-form';
import { ProfilComponent, UserProfil } from '../profil/profil';
import { StageService } from '../services/stage';
import { CandidaturesComponent } from '../candidatures/candidatures';
import { CandidatureService } from '../services/candidature';
import { StagiairesComponent } from '../stagiaires/stagiaires';
import { EncadrantsComponent } from '../encadrants/encadrants';

type ActiveView =
  | 'welcome' | 'dashboard' | 'list' | 'detail' | 'form' | 'profil'
  | 'candidatures' | 'stagiaires' | 'encadrants'
  | 'evaluations' | 'archives' | 'parametres';

@Component({
  selector: 'app-gestion-stages',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    DashboardComponent,
    OffresListComponent,
    OffreFormComponent,
    ProfilComponent,
    CandidaturesComponent,
    StagiairesComponent,
    EncadrantsComponent
  ],
  templateUrl: './gestion-stages.html',
  styleUrls: ['./gestion-stages.css']
})
export class GestionStagesComponent implements OnInit {

  sidebarOpen = false;
  sidebarCollapsed = false;
  avatarMenuOpen = false;
  notifMenuOpen = false;
  activeView: ActiveView = 'dashboard';
  selectedStage: OffreStage | null = null;

  candidaturesCount = 0;
  candidaturesEnAttente = 0;
  candidaturesAcceptees = 0;
  candidaturesRefusees = 0;
  dernieresCandidatures: Candidature[] = [];

  repartitionFilieres: { nom: string; count: number; pct: number }[] = [];
  repartitionCycles: { nom: string; count: number; pct: number }[] = [];
  topSujets: { titre: string; count: number }[] = [];

  userProfil: UserProfil = {
    nomComplet: localStorage.getItem('nomComplet') || '',
    email: localStorage.getItem('email') || '',
    role: localStorage.getItem('role') || '',
    telephone: localStorage.getItem('telephone') || ''
  };

  offres: OffreStage[] = [];

  // ✅ Propriétés simples au lieu de getters dynamiques
  totalOffres = 0;
  disponiblesCount = 0;

  constructor(
    private router: Router,
    private stageService: StageService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.syncViewFromUrl();
    this.chargerMesOffres();
    this.chargerCandidatures();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.syncViewFromUrl();
      });
  }

  private syncViewFromUrl(): void {
    const urlSegment = this.router.url.split('/').pop() || 'dashboard';

    const urlToView: Record<string, ActiveView> = {
      dashboard: 'dashboard',
      offres: 'list',
      candidatures: 'candidatures',
      stagiaires: 'stagiaires',
      encadrants: 'encadrants',
      evaluations: 'evaluations',
      archives: 'archives',
      parametres: 'parametres',
      profil: 'profil',
      'offre-form': 'form'
    };

    this.activeView = urlToView[urlSegment] ?? 'dashboard';
    // ✅ setTimeout évite le NG0100 en repoussant après le cycle de détection
    setTimeout(() => this.cdr.detectChanges());
  }

  chargerCandidatures(): void {
    this.candidatureService.getAll().subscribe({
      next: (data: any[]) => {
        this.candidaturesCount = data.length;
        this.candidaturesEnAttente = data.filter(c => c.statut === 'EN_ATTENTE').length;
        this.candidaturesAcceptees = data.filter(c => c.statut === 'ACCEPTE' || c.statut === 'ACCEPTEE').length;
        this.candidaturesRefusees = data.filter(c => c.statut === 'REFUSEE').length;

        this.dernieresCandidatures = data.slice(-5).reverse().map(c => ({
          nom: c.stagiaire?.nomComplet || '—',
          sujet: c.sujet?.titre || '—',
          filiere: c.stagiaire?.filiere?.nom || c.sujet?.filiereCible || '—',
          statut: c.statut,
          date: c.dateDepot
        }));

        const filMap: Record<string, number> = {};
        data.forEach(c => {
          const f = c.stagiaire?.filiere?.nom || c.sujet?.filiereCible || 'Autre';
          filMap[f] = (filMap[f] || 0) + 1;
        });

        this.repartitionFilieres = Object.entries(filMap)
          .map(([nom, count]) => ({
            nom,
            count,
            pct: data.length > 0 ? Math.round((count / data.length) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        const cycMap: Record<string, number> = {};
        data.forEach(c => {
          const cy = c.stagiaire?.cycle?.nom || c.sujet?.cycleCible || 'Autre';
          cycMap[cy] = (cycMap[cy] || 0) + 1;
        });

        this.repartitionCycles = Object.entries(cycMap)
          .map(([nom, count]) => ({
            nom,
            count,
            pct: data.length > 0 ? Math.round((count / data.length) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        const sujetMap: Record<string, number> = {};
        data.forEach(c => {
          const s = c.sujet?.titre || 'Inconnu';
          sujetMap[s] = (sujetMap[s] || 0) + 1;
        });

        this.topSujets = Object.entries(sujetMap)
          .map(([titre, count]) => ({ titre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // ✅ Pas de cdr.detectChanges() ici
      },
      error: () => {}
    });
  }

  chargerMesOffres(): void {
    this.stageService.getMesOffres().subscribe({
      next: (data: any[]) => {
        this.offres = data.map((o: any) => ({
          id: o.id,
          titre: o.titre,
          description: o.description,
          filiereCible: o.filiereCible,
          cycleCible: o.cycleCible,
          competences: o.competencesCibles || [],
          statut: o.estDisponible ? 'Ouvert' : 'Fermé',
          datePublication: new Date(o.datePublication),
          estDisponible: o.estDisponible
        }));
        // ✅ Mise à jour des propriétés simples ici
        this.totalOffres = this.offres.length;
        this.disponiblesCount = this.offres.filter(o => o.estDisponible).length;
      },
      error: (err: any) => console.error('Erreur chargement offres', err)
    });
  }

  get userName(): string {
    return localStorage.getItem('nomComplet') || 'Admin RH';
  }

  get userEmail(): string {
    return localStorage.getItem('email') || '';
  }

  get userInitials(): string {
    const parts = this.userName.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : this.userName.slice(0, 2).toUpperCase();
  }

  get firstName(): string {
    return this.userName.trim().split(' ')[0] || 'RH';
  }

  goToWelcome() { this.navigate('welcome'); }
  goToDashboard() { this.navigate('dashboard'); }
  goToList() { this.navigate('list'); }
  goToProfil() { this.navigate('profil'); }
  goToCandidatures() { this.navigate('candidatures'); }
  goToStagiaires() { this.navigate('stagiaires'); }
  goToEncadrants() { this.navigate('encadrants'); }
  goToEvaluations() { this.navigate('evaluations'); }
  goToArchives() { this.navigate('archives'); }
  goToParametres() { this.navigate('parametres'); }

  ouvrirFormulaire(stage: OffreStage | null = null) { this.navigate('form', stage); }
  voirDetail(stage: OffreStage) { this.navigate('detail', stage); }
  retourListe() { this.navigate('list'); }
  retourAccueil() { this.navigate('dashboard'); }

  deconnecter(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onProfilSaved(profil: UserProfil): void {
    this.userProfil = profil;
    localStorage.setItem('nomComplet', profil.nomComplet);
    localStorage.setItem('email', profil.email);
    localStorage.setItem('telephone', profil.telephone ?? '');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.gtb-avatar-wrap')) this.avatarMenuOpen = false;
    if (!target.closest('.gtb-notif-wrap')) this.notifMenuOpen = false;
  }

  private navigate(view: ActiveView, stage: OffreStage | null = null): void {
    this.sidebarOpen = false;
    this.activeView = view;
    this.selectedStage = stage;

    const urlMap: Partial<Record<ActiveView, string>> = {
      dashboard: '/gestion-stages/dashboard',
      list: '/gestion-stages/offres',
      candidatures: '/gestion-stages/candidatures',
      stagiaires: '/gestion-stages/stagiaires',
      encadrants: '/gestion-stages/encadrants',
      evaluations: '/gestion-stages/evaluations',
      archives: '/gestion-stages/archives',
      parametres: '/gestion-stages/parametres',
      profil: '/gestion-stages/profil',
      form: '/gestion-stages/offre-form'
    };

    const url = urlMap[view];
    if (url) this.router.navigate([url]);
  }

  supprimerOffre(id: number | undefined): void {
    if (id === undefined) return;

    this.stageService.supprimerOffre(id).subscribe({
      next: () => {
        this.offres = this.offres.filter(o => o.id !== id);
        this.totalOffres = this.offres.length;
        this.disponiblesCount = this.offres.filter(o => o.estDisponible).length;
        this.navigate('list');
      },
      error: (err: any) => console.error('Erreur suppression', err)
    });
  }

  onSauvegarder(offre: OffreStage): void {
    const payload = {
      titre: offre.titre,
      description: offre.description,
      filiereCible: offre.filiereCible,
      cycleCible: offre.cycleCible,
      competencesCibles: offre.competences,
      estDisponible: offre.estDisponible
    };

    if (!offre.id) {
      this.stageService.publierOffre(payload).subscribe({
        next: () => {
          this.chargerMesOffres();
          this.navigate('list');
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.stageService.modifierOffre(offre.id, payload).subscribe({
        next: () => {
          this.chargerMesOffres();
          this.navigate('list');
        },
        error: (err: any) => console.error(err)
      });
    }
  }
}
