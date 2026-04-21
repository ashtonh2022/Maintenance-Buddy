export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          file_path: string
          file_size: number
          file_type: string
          id: string
          timeline_entry_id: string
          uploaded_at: string
        }
        Insert: {
          file_path: string
          file_size: number
          file_type: string
          id?: string
          timeline_entry_id: string
          uploaded_at?: string
        }
        Update: {
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          timeline_entry_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_timeline_entry_id_fkey"
            columns: ["timeline_entry_id"]
            isOneToOne: false
            referencedRelation: "timeline_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          is_sent: boolean
          message: string
          scheduled_date: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          message: string
          scheduled_date: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          message?: string
          scheduled_date?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_estimated_mileage"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          notifications_enabled: boolean
          role: string
          units: string
        }
        Insert: {
          created_at?: string
          id: string
          notifications_enabled?: boolean
          role?: string
          units?: string
        }
        Update: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean
          role?: string
          units?: string
        }
        Relationships: []
      }
      required_services: {
        Row: {
          created_at: string
          id: string
          interval_miles: number
          service_name: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interval_miles: number
          service_name: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval_miles?: number
          service_name?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "required_services_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "required_services_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_estimated_mileage"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_entries: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          is_completed: boolean
          mechanic_shop: string | null
          mileageatservice: number | null
          service_type: string
          tags: string[] | null
          time: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_completed?: boolean
          mechanic_shop?: string | null
          mileageatservice?: number | null
          service_type: string
          tags?: string[] | null
          time?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          mechanic_shop?: string | null
          mileageatservice?: number | null
          service_type?: string
          tags?: string[] | null
          time?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_estimated_mileage"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          make: string
          mileage_rate: number
          mileage_updated_at: string
          model: string
          recent_mileage: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          make: string
          mileage_rate?: number
          mileage_updated_at?: string
          model: string
          recent_mileage?: number
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          make?: string
          mileage_rate?: number
          mileage_updated_at?: string
          model?: string
          recent_mileage?: number
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vehicles_with_estimated_mileage: {
        Row: {
          created_at: string | null
          estimated_mileage: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"] | null
          id: string | null
          make: string | null
          mileage_rate: number | null
          mileage_updated_at: string | null
          model: string | null
          recent_mileage: number | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          estimated_mileage?: never
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          id?: string | null
          make?: string | null
          mileage_rate?: number | null
          mileage_updated_at?: string | null
          model?: string | null
          recent_mileage?: number | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          estimated_mileage?: never
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          id?: string | null
          make?: string | null
          mileage_rate?: number | null
          mileage_updated_at?: string | null
          model?: string | null
          recent_mileage?: number | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      fuel_type: "petrol" | "diesel" | "hybrid" | "electric"
      notification_type: "maintenance_due" | "appointment_reminder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fuel_type: ["petrol", "diesel", "hybrid", "electric"],
      notification_type: ["maintenance_due", "appointment_reminder"],
    },
  },
} as const
