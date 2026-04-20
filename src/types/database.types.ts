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
      maintenance_schedules: {
        Row: {
          created_at: string
          created_by: string
          id: string
          make: string
          model: string
          status: Database["public"]["Enums"]["schedule_status"]
          year: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          make: string
          model: string
          status?: Database["public"]["Enums"]["schedule_status"]
          year: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          make?: string
          model?: string
          status?: Database["public"]["Enums"]["schedule_status"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_sent: boolean
          is_read: boolean;
          message: string
          scheduled_date: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean
          is_read?: boolean;
          message: string
          scheduled_date: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean
          is_read?: boolean;
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
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          yearly_mileage_rate: number | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          yearly_mileage_rate?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          yearly_mileage_rate?: number | null
        }
        Relationships: []
      }
      scheduled_services: {
        Row: {
          description: string | null
          id: string
          interval_miles: number | null
          interval_months: number | null
          schedule_id: string
          service_name: string
        }
        Insert: {
          description?: string | null
          id?: string
          interval_miles?: number | null
          interval_months?: number | null
          schedule_id: string
          service_name: string
        }
        Update: {
          description?: string | null
          id?: string
          interval_miles?: number | null
          interval_months?: number | null
          schedule_id?: string
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_services_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "maintenance_schedules"
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
          mileage_at_service: number | null
          mileageatservice: number | null
          service_type: string
          time: string | null
          vehicle_id: string
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_completed?: boolean
          mechanic_shop?: string | null
          mileage_at_service?: number | null
          mileageatservice?: number | null
          service_type: string
          time?: string | null
          vehicle_id: string
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          mechanic_shop?: string | null
          mileage_at_service?: number | null
          mileageatservice?: number | null
          service_type?: string
          time?: string | null
          vehicle_id?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notification_type: "maintenance_due" | "appointment_reminder"
      schedule_status: "draft" | "pending" | "approved"
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
      notification_type: ["maintenance_due", "appointment_reminder"],
      schedule_status: ["draft", "pending", "approved"],
    },
  },
} as const
