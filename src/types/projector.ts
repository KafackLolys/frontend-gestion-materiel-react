export type ProjectorEtat = "disponible" | "emprunte" | "en_maintenance" | "hors_service";
export interface Projector {
  id: number;
  user_id: number;
  ref: string;
  marque: string;
  description: string;
  etat: ProjectorEtat;
  image: string;
}

export type ProjectorsApiResponse = {
  data: Projector[];
  meta: {
    total: number[];
    per_page: number[];
    current_page: number;
    last_page: number[];
    from: number;
    to: number;
  };
  filters: {
    search: string | null;
    sort_by: string;
    order: string;
  };
  status: number;
  success: boolean;
};