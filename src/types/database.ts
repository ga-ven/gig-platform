export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employer_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      worker_profiles: {
        Row: {
          id: string
          user_id: string
          skills: string[]
          availability: Json
          avg_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skills?: string[]
          availability?: Json
          avg_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skills?: string[]
          availability?: Json
          avg_rating?: number | null
          created_at?: string
        }
        Relationships: []
      }
      job_posts: {
        Row: {
          id: string
          employer_id: string
          title: string
          description: string | null
          required_skills: string[]
          location: string | null
          job_time_start: string | null
          job_time_end: string | null
          pay_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          description?: string | null
          required_skills?: string[]
          location?: string | null
          job_time_start?: string | null
          job_time_end?: string | null
          pay_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          description?: string | null
          required_skills?: string[]
          location?: string | null
          job_time_start?: string | null
          job_time_end?: string | null
          pay_amount?: number
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employer_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          worker_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          worker_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          worker_id?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          job_id: string
          payer_id: string
          payee_id: string
          amount: number
          status: string
          wx_transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          payer_id: string
          payee_id: string
          amount: number
          status?: string
          wx_transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          payer_id?: string
          payee_id?: string
          amount?: number
          status?: string
          wx_transaction_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database }
    | { schema: "public"; name: string },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: "public" },
  TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: "public" }
  ? Database["public"]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: "public" },
  TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: "public" }
  ? Database["public"]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: "public"; name: string },
  EnumName extends PublicEnumNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: "public" }
  ? Database["public"]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
