import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { OffreStage } from '../shared/offre-stage.model';

export interface Candidature {
nom: string; sujet?: string; filiere?: string;
statut: 'EN_ATTENTE' | 'ACCEPTO' | 'ACCEPTEE' | 'REFUSEE';
date?: Date | string;
}

@Component({
selector: 'app-dashboard',
standalone: true,
imports: [CommonModule, SlicePipe],
templateUrl: './dashboard.html',
styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

@Input() offres: OffreStage[]  = [];
@Input() totalOffres           = 0;
@Input() disponiblesCount      = 0;
@Input() candidaturesCount     = 0;
@Input() candidaturesEnAttente = 0;
@Input() candidaturesAcceptees = 0;
@Input() candidaturesRefusees  = 0;
@Input() cvCount               = 0; // ← ajouté
@Input() dernieresCandidatures: Candidature[] = [];
@Input() repartitionFilieres: { nom: string; count: number; pct: number }[] = [];
@Input() repartitionCycles:   { nom: string; count: number; pct: number }[] = [];
@Input() topSujets:           { titre: string; count: number }[] = [];
@Input() firstName             = 'RH';

@Output() goList         = new EventEmitter<void>();
@Output() goCandidatures = new EventEmitter<void>();

today = '';
private timer: any;

ngOnInit(): void {
    this.updateDate();
    this.timer = setInterval(() => this.updateDate(), 60000);
  }
  ngOnDestroy(): void { if (this.timer) clearInterval(this.timer); }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return 'Bonjour';
    if (h >= 12 && h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  private updateDate(): void {
    this.today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  isAccepte(statut: string): boolean {
    return statut === 'ACCEPTO' || statut === 'ACCEPTEE';
  }

  getInitials(nom: string): string {
    if (!nom) return '?';
    return nom.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('');
  }

  getAvatarColor(nom: string): string {
    const colors = ['#4f46e5','#7c3aed','#db2777','#dc2626','#d97706','#059669','#0284c7','#0891b2'];
    if (!nom) return colors[0];
    return colors[nom.charCodeAt(0) % colors.length];
  }

  get tauxAcceptation(): number {
    return this.candidaturesCount > 0 ? Math.round(this.candidaturesAcceptees / this.candidaturesCount * 100) : 0;
  }
  get tauxRefus(): number {
    return this.candidaturesCount > 0 ? Math.round(this.candidaturesRefusees / this.candidaturesCount * 100) : 0;
  }
  get ratioCandSujet(): string {
    return this.totalOffres > 0 ? (this.candidaturesCount / this.totalOffres).toFixed(1) : '0';
  }
}
