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
      company_profiles: {
        Row: {
          ceo: string | null
          employees: string | null
          executives: Json | null
          founded: string | null
          global_presence: Json | null
          headquarters: string | null
          id: string
          industry_position: string | null
          revenue_drivers: Json | null
          segments: Json | null
          source: string | null
          summary: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          ceo?: string | null
          employees?: string | null
          executives?: Json | null
          founded?: string | null
          global_presence?: Json | null
          headquarters?: string | null
          id?: string
          industry_position?: string | null
          revenue_drivers?: Json | null
          segments?: Json | null
          source?: string | null
          summary?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          ceo?: string | null
          employees?: string | null
          executives?: Json | null
          founded?: string | null
          global_presence?: Json | null
          headquarters?: string | null
          id?: string
          industry_position?: string | null
          revenue_drivers?: Json | null
          segments?: Json | null
          source?: string | null
          summary?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          alert_id: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          symbol: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          alert_id?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          symbol?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          alert_id?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          symbol?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "user_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          email: string
          experience_level: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          experience_level?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          experience_level?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_analysis_cache: {
        Row: {
          confidence: number | null
          id: string
          insight: string | null
          momentum: string | null
          risk: string | null
          rsi_14: number | null
          sma_20: number | null
          sma_200: number | null
          sma_50: number | null
          symbol: string
          trend: string | null
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          id?: string
          insight?: string | null
          momentum?: string | null
          risk?: string | null
          rsi_14?: number | null
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          symbol: string
          trend?: string | null
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          id?: string
          insight?: string | null
          momentum?: string | null
          risk?: string | null
          rsi_14?: number | null
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          symbol?: string
          trend?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          close: number
          created_at: string
          date: string
          high: number
          id: string
          low: number
          open: number
          symbol: string
          volume: number | null
        }
        Insert: {
          close: number
          created_at?: string
          date: string
          high: number
          id?: string
          low: number
          open: number
          symbol: string
          volume?: number | null
        }
        Update: {
          close?: number
          created_at?: string
          date?: string
          high?: number
          id?: string
          low?: number
          open?: number
          symbol?: string
          volume?: number | null
        }
        Relationships: []
      }
      stock_prices: {
        Row: {
          change: number
          change_percent: number
          delay_label: string | null
          discrepancy: boolean | null
          exchange: string | null
          high_52w: number | null
          id: string
          low_52w: number | null
          market_cap: string | null
          pe: number | null
          price: number
          source: string | null
          symbol: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          change?: number
          change_percent?: number
          delay_label?: string | null
          discrepancy?: boolean | null
          exchange?: string | null
          high_52w?: number | null
          id?: string
          low_52w?: number | null
          market_cap?: string | null
          pe?: number | null
          price: number
          source?: string | null
          symbol: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          change?: number
          change_percent?: number
          delay_label?: string | null
          discrepancy?: boolean | null
          exchange?: string | null
          high_52w?: number | null
          id?: string
          low_52w?: number | null
          market_cap?: string | null
          pe?: number | null
          price?: number
          source?: string | null
          symbol?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          active: boolean
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at: string
          exchange: string
          id: string
          last_triggered_at: string | null
          note: string | null
          sma_fast: number | null
          sma_slow: number | null
          symbol: string
          threshold: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          exchange: string
          id?: string
          last_triggered_at?: string | null
          note?: string | null
          sma_fast?: number | null
          sma_slow?: number | null
          symbol: string
          threshold?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          alert_type?: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          exchange?: string
          id?: string
          last_triggered_at?: string | null
          note?: string | null
          sma_fast?: number | null
          sma_slow?: number | null
          symbol?: string
          threshold?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_portfolio: {
        Row: {
          avg_buy_price: number
          created_at: string
          exchange: string
          id: string
          note: string | null
          purchased_at: string
          quantity: number
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_buy_price: number
          created_at?: string
          exchange: string
          id?: string
          note?: string | null
          purchased_at?: string
          quantity: number
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_buy_price?: number
          created_at?: string
          exchange?: string
          id?: string
          note?: string | null
          purchased_at?: string
          quantity?: number
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          added_at: string
          exchange: string
          id: string
          note: string | null
          symbol: string
          user_id: string
        }
        Insert: {
          added_at?: string
          exchange: string
          id?: string
          note?: string | null
          symbol: string
          user_id: string
        }
        Update: {
          added_at?: string
          exchange?: string
          id?: string
          note?: string | null
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type:
        | "price_above"
        | "price_below"
        | "sma_crossover_bullish"
        | "sma_crossover_bearish"
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
      alert_type: [
        "price_above",
        "price_below",
        "sma_crossover_bullish",
        "sma_crossover_bearish",
      ],
    },
  },
} as const
