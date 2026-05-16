export interface Accessory {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  description: string;
  image: string | null;
}

export type AccessoriesApiResponse = {
  data: Accessory[];
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
