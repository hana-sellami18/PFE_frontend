import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreStage } from '../shared/offre-stage.model';

@Component({
  selector: 'app-offres-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offres-list.html',
  styleUrls: ['./offres-list.css']
})
export class OffresListComponent {

  @Input() offres: OffreStage[] = [];
  @Input() totalOffres      = 0;
  @Input() disponiblesCount = 0;

  @Output() supprimer   = new EventEmitter<number>();
  @Output() openSidebar = new EventEmitter<void>();
  @Output() openForm    = new EventEmitter<OffreStage | undefined>();
  @Output() voirDetail  = new EventEmitter<OffreStage>();

  searchQuery   = '';
  searchFocused = false;
  viewMode: 'table' | 'cards' = 'table';

  get fermeesCount(): number {
    return this.totalOffres - this.disponiblesCount;
  }

  get filteredOffres(): OffreStage[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return [...this.offres];
    return this.offres.filter(o =>
      o.titre.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.competences.some((c: string) => c.toLowerCase().includes(q))
    );
  }

  formatIndex(i: number): string {
    const n = i + 1;
    return n < 10 ? '0' + n : '' + n;
  }

  formatDate(date: any): string {
    if (!date) return '—';
    const d = new Date(date);
    const months = ['Jan','Fév','Mar','Avr','Mai','Juin',
                    'Juil','Aoû','Sep','Oct','Nov','Déc'];
    const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  formatDateRelative(date: any): string {
    if (!date) return '';
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
    if (diff === 0)  return "Aujourd'hui";
    if (diff === 1)  return 'Hier';
    if (diff < 7)    return `Il y a ${diff} j.`;
    if (diff < 30)   return `Il y a ${Math.floor(diff / 7)} sem.`;
    if (diff < 365)  return `Il y a ${Math.floor(diff / 30)} mois`;
    const y = Math.floor(diff / 365);
    return `Il y a ${y} an${y > 1 ? 's' : ''}`;
  }

  onSupprimer(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Supprimer cette offre définitivement ?')) {
      this.supprimer.emit(id);
    }
  }
}
