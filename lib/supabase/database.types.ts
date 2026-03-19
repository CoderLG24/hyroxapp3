export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      daily_completions: {
        Row: {
          athlete_id: "lawton" | "katy";
          date: string;
          goals: Json;
          household_id: string;
          notes: string | null;
          readiness_status: "green" | "yellow" | "red" | null;
          rpe: number | null;
          sleep_hours: number | null;
          soreness: number | null;
          symptom_notes: string | null;
          updated_at: string;
        };
        Insert: {
          athlete_id: "lawton" | "katy";
          date: string;
          goals: Json;
          household_id: string;
          notes?: string | null;
          readiness_status?: "green" | "yellow" | "red" | null;
          rpe?: number | null;
          sleep_hours?: number | null;
          soreness?: number | null;
          symptom_notes?: string | null;
          updated_at?: string;
        };
        Update: {
          athlete_id?: "lawton" | "katy";
          date?: string;
          goals?: Json;
          household_id?: string;
          notes?: string | null;
          readiness_status?: "green" | "yellow" | "red" | null;
          rpe?: number | null;
          sleep_hours?: number | null;
          soreness?: number | null;
          symptom_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_completions_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      household_settings: {
        Row: {
          cycle_anchor_date: string;
          cycle_length: number;
          household_id: string;
          hydration_targets: Json;
          protein_targets: Json;
          step_targets: Json;
          updated_at: string;
        };
        Insert: {
          cycle_anchor_date: string;
          cycle_length: number;
          household_id: string;
          hydration_targets: Json;
          protein_targets: Json;
          step_targets: Json;
          updated_at?: string;
        };
        Update: {
          cycle_anchor_date?: string;
          cycle_length?: number;
          household_id?: string;
          hydration_targets?: Json;
          protein_targets?: Json;
          step_targets?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "household_settings_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: true;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      households: {
        Row: {
          created_at: string;
          id: string;
          join_code: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          join_code: string;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          join_code?: string;
          name?: string;
        };
        Relationships: [];
      };
      reward_redemptions: {
        Row: {
          athlete_id: "lawton" | "katy" | null;
          cost: number;
          household_id: string;
          id: string;
          redeemed_on: string;
          reward_id: string;
          scope: "personal" | "shared";
        };
        Insert: {
          athlete_id?: "lawton" | "katy" | null;
          cost: number;
          household_id: string;
          id: string;
          redeemed_on: string;
          reward_id: string;
          scope: "personal" | "shared";
        };
        Update: {
          athlete_id?: "lawton" | "katy" | null;
          cost?: number;
          household_id?: string;
          id?: string;
          redeemed_on?: string;
          reward_id?: string;
          scope?: "personal" | "shared";
        };
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
