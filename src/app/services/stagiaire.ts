import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Encadrant {
  id: number;
  nomComplet: string;
  email: string;
}

export interface Stagiaire {
  id: number;
  utilisateur?: {
    id: number;
    nomComplet: string;
    email: string;
    telephone?: string;
    filiere?: { id: number; nom: string };
    cycle?: { id: number; nom: string };
    etablissement?: string;
  };
  sujet?: {
    id: number;
    titre: string;
    filiereCible: string;
    cycleCible: string;
  };
  candidature: { id: number };
  encadrant?: {
    id: number;
    nomComplet: string;
    email: string;
  };
  dateDebut: string;
  dateFin?: string;
  statusStage: 'EN_COURS' | 'TERMINE' | 'SUSPENDU';
}

@Injectable({ providedIn: 'root' })
export class StagiaireService {
  private baseUrl = 'http://localhost:8089/api/stagiaires';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<Stagiaire[]> {
    return this.http.get<Stagiaire[]>(this.baseUrl, { headers: this.headers() });
  }

  terminer(id: number): Observable<Stagiaire> {
    return this.http.put<Stagiaire>(`${this.baseUrl}/${id}/terminer`, {}, { headers: this.headers() });
  }

  getEncadrants(): Observable<Encadrant[]> {
    return this.http.get<Encadrant[]>(`${this.baseUrl}/encadrants`, { headers: this.headers() });
  }

  affecterEncadrant(stagiaireId: number, encadrantId: number): Observable<Stagiaire> {
    return this.http.put<Stagiaire>(
      `${this.baseUrl}/${stagiaireId}/affecter-encadrant?encadrantId=${encadrantId}`,
      {},
      { headers: this.headers() }
    );
  }
}
