import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stagiaire {
  id?: number;
  nomComplet?: string;
  email?: string;
  filiere?: string;
  cycle?: string;
}

export interface SujetStage {
  id?: number;
  titre?: string;
  filiereCible?: string;
  cycleCible?: string;
}

// ✅ 'ACCEPTE' — correspond exactement à l'enum Java StatusCandidature
export interface Candidature {
  id:                   number;
  stagiaire?:           Stagiaire;
  sujet?:               SujetStage;
  statut:               'EN_ATTENTE' | 'ACCEPTE' | 'REFUSEE';
  dateDepot?:           string | Date;
  dateEntretien?:       string | Date;
  cvPath?:              string;
  scoreMatchingIA?:     number;
  competencesExtraites?: string[];
}

@Injectable({ providedIn: 'root' })
export class CandidatureService {

  private readonly base = 'http://localhost:8089/api/candidatures';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(this.base);
  }

  getById(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.base}/${id}`);
  }

  // ✅ PUT — correspond à @PutMapping du backend
  accepter(id: number): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.base}/${id}/accepter`, {});
  }

  refuser(id: number): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.base}/${id}/refuser`, {});
  }

  planifierEntretien(id: number, dateEntretien: string): Observable<Candidature> {
    return this.http.put<Candidature>(
      `${this.base}/${id}/entretien`,
      { dateEntretien }
    );
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
