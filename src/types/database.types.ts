export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserType = 'admin' | 'school'
export type SchoolStatus = 'active' | 'inactive' | 'pending'
export type PlanType = 'basic' | 'pro' | 'enterprise'
export type AlertType = 'intrusion' | 'face' | 'crowd' | 'object' | 'camera_offline'
export type AlertStatus = 'novo' | 'confirmado' | 'resolvido' | 'falso'
export type AlertSeverity = 'baixa' | 'media' | 'alta'
export type CameraStatus = 'online' | 'offline'
export type CameraSensitivity = 'baixa' | 'media' | 'alta'
export type NotificationType = 'alert' | 'financial' | 'system'
export type NotificationSeverity = 'high' | 'medium' | 'low'
export type NotificationStatus = 'read' | 'unread'
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          user_type: UserType
          school_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          user_type?: UserType
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          user_type?: UserType
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          cnpj: string
          plan: PlanType
          status: SchoolStatus
          contact_name: string | null
          contact_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cnpj: string
          plan?: PlanType
          status?: SchoolStatus
          contact_name?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string
          plan?: PlanType
          status?: SchoolStatus
          contact_name?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      environments: {
        Row: {
          id: string
          school_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          environment_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          environment_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          environment_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cameras: {
        Row: {
          id: string
          school_id: string
          location_id: string | null
          name: string
          rtsp_url: string
          status: CameraStatus
          ai_enabled: boolean
          facial_recognition: boolean
          people_count: boolean
          sensitivity: CameraSensitivity
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          location_id?: string | null
          name: string
          rtsp_url: string
          status?: CameraStatus
          ai_enabled?: boolean
          facial_recognition?: boolean
          people_count?: boolean
          sensitivity?: CameraSensitivity
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          location_id?: string | null
          name?: string
          rtsp_url?: string
          status?: CameraStatus
          ai_enabled?: boolean
          facial_recognition?: boolean
          people_count?: boolean
          sensitivity?: CameraSensitivity
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          camera_id: string | null
          school_id: string
          type: AlertType
          title: string
          description: string
          status: AlertStatus
          severity: AlertSeverity
          stream_url: string | null
          action_by_user_id: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          camera_id?: string | null
          school_id: string
          type: AlertType
          title: string
          description: string
          status?: AlertStatus
          severity?: AlertSeverity
          stream_url?: string | null
          action_by_user_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          camera_id?: string | null
          school_id?: string
          type?: AlertType
          title?: string
          description?: string
          status?: AlertStatus
          severity?: AlertSeverity
          stream_url?: string | null
          action_by_user_id?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          school_id: string
          name: string
          role: string
          phone: string
          email: string
          receive_whatsapp: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          role: string
          phone: string
          email: string
          receive_whatsapp?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          role?: string
          phone?: string
          email?: string
          receive_whatsapp?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          school_id: string | null
          type: NotificationType
          severity: NotificationSeverity | null
          title: string
          description: string
          origin: string
          status: NotificationStatus
          action_label: string | null
          action_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          school_id?: string | null
          type: NotificationType
          severity?: NotificationSeverity | null
          title: string
          description: string
          origin: string
          status?: NotificationStatus
          action_label?: string | null
          action_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          school_id?: string | null
          type?: NotificationType
          severity?: NotificationSeverity | null
          title?: string
          description?: string
          origin?: string
          status?: NotificationStatus
          action_label?: string | null
          action_path?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          school_id: string
          amount: number
          status: InvoiceStatus
          due_date: string
          paid_date: string | null
          reference_month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          amount: number
          status?: InvoiceStatus
          due_date: string
          paid_date?: string | null
          reference_month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          amount?: number
          status?: InvoiceStatus
          due_date?: string
          paid_date?: string | null
          reference_month?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: UserType
      school_status: SchoolStatus
      plan_type: PlanType
      alert_type: AlertType
      alert_status: AlertStatus
      alert_severity: AlertSeverity
      camera_status: CameraStatus
      camera_sensitivity: CameraSensitivity
      notification_type: NotificationType
      notification_severity: NotificationSeverity
      notification_status: NotificationStatus
      invoice_status: InvoiceStatus
    }
  }
}
