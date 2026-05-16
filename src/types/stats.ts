export interface StatsData {
  users: {
    total: number;
  };
  projectors: {
    total: number;
    by_status: {
      disponible: number;
      emprunte: number;
      en_maintenance: number;
      hors_service: number;
    };
  };
  loans: {
    total: number;
    by_status: {
      pending: number;
      in_progress: number;
      completed: number;
    };
  };
  accessories?: {
    total: number;
  };
}

export interface StatsApiResponse {
  status: number;
  success: boolean;
  data: StatsData;
}
