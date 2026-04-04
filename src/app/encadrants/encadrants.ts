import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StagiaireService, Encadrant, Stagiaire } from '../services/stagiaire';

@Component({
selector: 'app-encadrants',
standalone: true,
imports: [CommonModule],
templateUrl: './encadrants.html',
styleUrls: ['./encadrants.css']
})
export class EncadrantsComponent implements OnInit {
encadrants: Encadrant[] = [];
stagiaires: Stagiaire[] = [];
loading = true;

constructor(
    private stagiaireService: StagiaireService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading = true;

    this.stagiaireService.getEncadrants().subscribe({
      next: (enc) => {
        this.encadrants = enc;

        this.stagiaireService.getAll().subscribe({
          next: (stag) => {
            this.stagiaires = stag;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erreur chargement stagiaires', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur chargement encadrants', err);
        this.loading = false;
      }
    });
  }

  get encadrantsAvecAffectation(): number {
    return this.encadrants.filter(e => this.getStagiairesOfEncadrant(e.id).length > 0).length;
  }

  getStagiairesOfEncadrant(encadrantId: number): Stagiaire[] {
    return this.stagiaires.filter(s => s.encadrant?.id === encadrantId);
  }

  getInitials(nom: string | null | undefined): string {
    if (!nom) return '?';

    return nom
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(n => n[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getAvatarColor(nom: string | null | undefined): string {
    const colors = ['#4f46e5', '#7c3aed', '#db2777', '#059669', '#0284c7', '#d97706'];
    if (!nom) return colors[0];
    return colors[nom.charCodeAt(0) % colors.length];
  }

  trackByEncadrant(index: number, e: Encadrant): number {
    return e.id;
  }

  trackByStagiaire(index: number, s: Stagiaire): number {
    return s.id;
  }
}
