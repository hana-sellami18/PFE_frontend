export interface OffreStage {
  id?: number; // Optionnel car absent lors de la création
  titre: string;
  description: string;

  // Noms synchronisés avec ton Formulaire et MySQL
  filiereCible: string;
  cycleCible: string;

  // Utilise 'estDisponible' pour correspondre à ton TypeScript
  estDisponible: boolean;

  // Liste des compétences (doit être string[] pour matcher ton frontend)
  competences: string[];

  // Champs optionnels pour le suivi
  statut?: 'Ouvert' | 'Fermé' | 'En attente';
  datePublication?: Date | string;
  idRh?: number;
}
