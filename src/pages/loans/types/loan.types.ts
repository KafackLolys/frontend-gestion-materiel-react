// types/loan.types.ts
export interface ProjectorRelation {
  id: number;
  marque: string;
  ref?: string;
  image?: string;
  etat?: string;
}

export interface UserRelation {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface AccessoryRelation {
  id: number;
  name: string;
  pivot: {
    quantity: number;
  };
}

export interface Loan {
  id: number;
  user_id: number;
  projector_id: number | null;
  loan_date: string;
  return_date: string | null;
  classroom: string | null;
  room: string | null;
  cni_number: string;
  status: "pending" | "in_progress" | "completed";
  starting_state: string | null;
  ending_state: string | null;
  teacher_name: string | null;
  created_at: string;
  updated_at: string | null;
  // Relations
  user?: UserRelation;
  projector?: ProjectorRelation;
  accessories?: AccessoryRelation[];
}