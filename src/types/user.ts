export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image_profil: string
}

export type UsersApiResponse = {
  data: User[];
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