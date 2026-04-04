import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService, Candidature } from '../services/candidature';

type FilterStatut = 'TOUS' | 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSEE';

@Component({
selector: 'app-candidatures',
standalone: true,
imports: [CommonModule, FormsModule, DecimalPipe],
templateUrl: './candidatures.html',
styleUrls: ['./candidatures.css']
})
export class CandidaturesComponent implements OnInit {
@Output() retour = new EventEmitter<void>();

candidatures: Candidature[] = [];
loading = true;
searchQuery = '';
searchFocused = false;
filterStatut: FilterStatut = 'TOUS';
selectedCand: Candidature | null = null;
showEntretienModal = false;
dateEntretien = '';
actionLoading = false;

constructor(
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading = true;
    this.candidatureService.getAll().subscribe({
      next: (data: Candidature[]) => {
        this.candidatures = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get filtered(): Candidature[] {
    let result = [...this.candidatures];

    if (this.filterStatut !== 'TOUS') {
      result = result.filter(c => c.statut === this.filterStatut);
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(c =>
        c.stagiaire?.nomComplet?.toLowerCase().includes(q) ||
        c.sujet?.titre?.toLowerCase().includes(q) ||
        c.stagiaire?.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }

  get totalEnAttente(): number {
    return this.candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
  }

  get totalAcceptees(): number {
    return this.candidatures.filter(c => c.statut === 'ACCEPTE').length;
  }

  get totalRefusees(): number {
    return this.candidatures.filter(c => c.statut === 'REFUSEE').length;
  }

  setFilter(f: FilterStatut): void {
    this.filterStatut = f;
  }

  voirDetail(c: Candidature): void {
    this.selectedCand = c;
    this.showEntretienModal = false;
    document.body.style.overflow = 'hidden';
  }

  fermerDetail(): void {
    this.selectedCand = null;
    this.showEntretienModal = false;
    document.body.style.overflow = '';
  }

  accepter(c: Candidature, event?: Event): void {
    if (event) event.stopPropagation();

    this.actionLoading = true;
    this.candidatureService.accepter(c.id).subscribe({
      next: (updated: Candidature) => {
        this.updateLocal(updated);
        if (this.selectedCand?.id === c.id) this.selectedCand = updated;
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoading = false;
      }
    });
  }

  refuser(c: Candidature, event?: Event): void {
    if (event) event.stopPropagation();

    this.actionLoading = true;
    this.candidatureService.refuser(c.id).subscribe({
      next: (updated: Candidature) => {
        this.updateLocal(updated);
        if (this.selectedCand?.id === c.id) this.selectedCand = updated;
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoading = false;
      }
    });
  }

  ouvrirEntretien(): void {
    this.showEntretienModal = true;
    this.dateEntretien = '';
  }

  planifierEntretien(): void {
    if (!this.selectedCand || !this.dateEntretien) return;

    this.actionLoading = true;
    this.candidatureService.planifierEntretien(this.selectedCand.id, this.dateEntretien).subscribe({
      next: (updated: Candidature) => {
        this.updateLocal(updated);
        this.selectedCand = updated;
        this.showEntretienModal = false;
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoading = false;
      }
    });
  }

  supprimer(id: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm('Supprimer cette candidature ?')) return;

    this.candidatureService.supprimer(id).subscribe({
      next: () => {
        this.candidatures = this.candidatures.filter(c => c.id !== id);
        if (this.selectedCand?.id === id) this.selectedCand = null;
        this.cdr.detectChanges();
      }
    });
  }

  private updateLocal(updated: Candidature): void {
    this.candidatures = this.candidatures.map(c => c.id === updated.id ? updated : c);
  }

  trackByCandId(index: number, c: Candidature): number {
    return c.id;
  }

  getInitials(nom: string): string {
    if (!nom) return '?';

    return nom
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(n => n[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getAvatarColor(nom: string): string {
    const colors = ['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0284c7', '#0891b2'];
    if (!nom) return colors[0];
    return colors[nom.charCodeAt(0) % colors.length];
  }

  formatDate(d: any): string {
    if (!d) return '—';

    const date = new Date(d);
    if (isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatDateRelative(d: any): string {
    if (!d) return '';

    const date = new Date(d);
    if (isNaN(date.getTime())) return '';

    const diff = Math.floor((Date.now() - date.getTime()) / 86400000);

    if (diff <= 0) return "Aujourd'hui";
    if (diff === 1) return 'Hier';
    if (diff < 7) return `Il y a ${diff} j.`;
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)} sem.`;
    return `Il y a ${Math.floor(diff / 30)} mois`;
  }

  getScoreLabel(score: number | null | undefined): string {
    if (score == null) return 'Non évalué';
    return `${Math.round(score)}%`;
  }

  getCvUrl(cvPath: string): string {
    if (!cvPath) return '';
    const path = cvPath.startsWith('uploads/') ? cvPath : `uploads/${cvPath}`;
    return `http://localhost:8085/${path}`;
  }

  ouvrirCv(cvPath: string): void {
    const url = this.getCvUrl(cvPath);
    if (url) window.open(url, '_blank');
  }
}
