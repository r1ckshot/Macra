export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          goal_kcal: number;
          goal_protein_g: number;
          goal_fat_g: number;
          goal_carbs_g: number;
          weight_kg: number | null;
          height_cm: number | null;
          age: number | null;
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          brand: string | null;
          barcode: string | null;
          kcal_per_100g: number;
          protein_g: number;
          fat_g: number;
          carbs_g: number;
          vitamins: Json;
          is_custom: boolean;
          source: 'open_food_facts' | 'custom';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      diary_days: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          carryover_kcal: number;
          water_ml: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['diary_days']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['diary_days']['Insert']>;
      };
      meals: {
        Row: {
          id: string;
          diary_day_id: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack_1' | 'snack_2' | 'snack_3';
          logged_at: string;
        };
        Insert: Omit<Database['public']['Tables']['meals']['Row'], 'id' | 'logged_at'> & {
          id?: string;
          logged_at?: string;
        };
        Update: Partial<Database['public']['Tables']['meals']['Insert']>;
      };
      food_entries: {
        Row: {
          id: string;
          meal_id: string;
          product_id: string;
          amount_g: number;
          unit: string;
          kcal: number;
          protein_g: number;
          fat_g: number;
          carbs_g: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['food_entries']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['food_entries']['Insert']>;
      };
      body_measurements: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight_kg: number | null;
          body_fat_pct: number | null;
          chest_cm: number | null;
          waist_cm: number | null;
          hips_cm: number | null;
          arms_cm: number | null;
          legs_cm: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['body_measurements']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['body_measurements']['Insert']>;
      };
    };
  };
}
