-- ================================================
-- SegVision - Complete Database Schema
-- All tables for the complete system
-- ================================================

-- ================================================
-- 1. CREATE ENUMS
-- ================================================

-- Alert types
CREATE TYPE alert_type AS ENUM ('intrusion', 'face', 'crowd', 'object', 'camera_offline');

-- Alert status
CREATE TYPE alert_status AS ENUM ('novo', 'confirmado', 'resolvido', 'falso');

-- Alert severity
CREATE TYPE alert_severity AS ENUM ('baixa', 'media', 'alta');

-- Camera status
CREATE TYPE camera_status AS ENUM ('online', 'offline');

-- Camera sensitivity
CREATE TYPE camera_sensitivity AS ENUM ('baixa', 'media', 'alta');

-- Notification type
CREATE TYPE notification_type AS ENUM ('alert', 'financial', 'system');

-- Notification severity
CREATE TYPE notification_severity AS ENUM ('high', 'medium', 'low');

-- Notification status
CREATE TYPE notification_status AS ENUM ('read', 'unread');

-- Invoice status
CREATE TYPE invoice_status AS ENUM ('paid', 'pending', 'overdue');

-- ================================================
-- 2. CREATE TABLES
-- ================================================

-- Environments (Espaços)
CREATE TABLE public.environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Locations (Locais dentro de espaços)
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    environment_id UUID NOT NULL REFERENCES public.environments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cameras
CREATE TABLE public.cameras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    rtsp_url TEXT NOT NULL,
    status camera_status NOT NULL DEFAULT 'offline',
    ai_enabled BOOLEAN NOT NULL DEFAULT false,
    facial_recognition BOOLEAN NOT NULL DEFAULT false,
    people_count BOOLEAN NOT NULL DEFAULT false,
    sensitivity camera_sensitivity NOT NULL DEFAULT 'media',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alerts
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id UUID REFERENCES public.cameras(id) ON DELETE SET NULL,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status alert_status NOT NULL DEFAULT 'novo',
    severity alert_severity NOT NULL DEFAULT 'media',
    stream_url TEXT,
    action_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Contacts
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    receive_whatsapp BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    severity notification_severity,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    origin TEXT NOT NULL,
    status notification_status NOT NULL DEFAULT 'unread',
    action_label TEXT,
    action_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status invoice_status NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_date DATE,
    reference_month TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- 3. CREATE INDEXES
-- ================================================

-- Environments
CREATE INDEX idx_environments_school_id ON public.environments(school_id);

-- Locations
CREATE INDEX idx_locations_environment_id ON public.locations(environment_id);

-- Cameras
CREATE INDEX idx_cameras_school_id ON public.cameras(school_id);
CREATE INDEX idx_cameras_location_id ON public.cameras(location_id);
CREATE INDEX idx_cameras_status ON public.cameras(status);

-- Alerts
CREATE INDEX idx_alerts_school_id ON public.alerts(school_id);
CREATE INDEX idx_alerts_camera_id ON public.alerts(camera_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);

-- Contacts
CREATE INDEX idx_contacts_school_id ON public.contacts(school_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_school_id ON public.notifications(school_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Invoices
CREATE INDEX idx_invoices_school_id ON public.invoices(school_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);

-- ================================================
-- 4. CREATE TRIGGERS FOR UPDATED_AT
-- ================================================

-- Environments
CREATE TRIGGER update_environments_updated_at
    BEFORE UPDATE ON public.environments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Locations
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Cameras
CREATE TRIGGER update_cameras_updated_at
    BEFORE UPDATE ON public.cameras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Contacts
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Invoices
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ENVIRONMENTS POLICIES
-- Users can read environments from their school
CREATE POLICY "environments_select_own_school"
  ON public.environments
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can insert environments for their school
CREATE POLICY "environments_insert_own_school"
  ON public.environments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can update environments from their school
CREATE POLICY "environments_update_own_school"
  ON public.environments
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can delete environments from their school
CREATE POLICY "environments_delete_own_school"
  ON public.environments
  FOR DELETE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- LOCATIONS POLICIES
-- Users can read locations from their school's environments
CREATE POLICY "locations_select_own_school"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (
    environment_id IN (
      SELECT e.id
      FROM public.environments e
      INNER JOIN public.users u ON e.school_id = u.school_id
      WHERE u.id = auth.uid()
    )
  );

-- Users can insert locations in their school's environments
CREATE POLICY "locations_insert_own_school"
  ON public.locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    environment_id IN (
      SELECT e.id
      FROM public.environments e
      INNER JOIN public.users u ON e.school_id = u.school_id
      WHERE u.id = auth.uid()
    )
  );

-- Users can update locations from their school
CREATE POLICY "locations_update_own_school"
  ON public.locations
  FOR UPDATE
  TO authenticated
  USING (
    environment_id IN (
      SELECT e.id
      FROM public.environments e
      INNER JOIN public.users u ON e.school_id = u.school_id
      WHERE u.id = auth.uid()
    )
  );

-- Users can delete locations from their school
CREATE POLICY "locations_delete_own_school"
  ON public.locations
  FOR DELETE
  TO authenticated
  USING (
    environment_id IN (
      SELECT e.id
      FROM public.environments e
      INNER JOIN public.users u ON e.school_id = u.school_id
      WHERE u.id = auth.uid()
    )
  );

-- CAMERAS POLICIES
-- Users can read cameras from their school
CREATE POLICY "cameras_select_own_school"
  ON public.cameras
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can insert cameras for their school
CREATE POLICY "cameras_insert_own_school"
  ON public.cameras
  FOR INSERT
  TO authenticated
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can update cameras from their school
CREATE POLICY "cameras_update_own_school"
  ON public.cameras
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can delete cameras from their school
CREATE POLICY "cameras_delete_own_school"
  ON public.cameras
  FOR DELETE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- ALERTS POLICIES
-- Users can read alerts from their school
CREATE POLICY "alerts_select_own_school"
  ON public.alerts
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can insert alerts for their school
CREATE POLICY "alerts_insert_own_school"
  ON public.alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can update alerts from their school
CREATE POLICY "alerts_update_own_school"
  ON public.alerts
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can delete alerts from their school
CREATE POLICY "alerts_delete_own_school"
  ON public.alerts
  FOR DELETE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- CONTACTS POLICIES
-- Users can read contacts from their school
CREATE POLICY "contacts_select_own_school"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can insert contacts for their school
CREATE POLICY "contacts_insert_own_school"
  ON public.contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can update contacts from their school
CREATE POLICY "contacts_update_own_school"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Users can delete contacts from their school
CREATE POLICY "contacts_delete_own_school"
  ON public.contacts
  FOR DELETE
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- NOTIFICATIONS POLICIES
-- Users can read their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert notifications for users
CREATE POLICY "notifications_insert_for_users"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- INVOICES POLICIES
-- Users can read invoices from their school
CREATE POLICY "invoices_select_own_school"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id
      FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Only admins/system can insert invoices
CREATE POLICY "invoices_insert_admin"
  ON public.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Only admins can update invoices
CREATE POLICY "invoices_update_admin"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Only admins can delete invoices
CREATE POLICY "invoices_delete_admin"
  ON public.invoices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- ================================================
-- 6. GRANT PERMISSIONS
-- ================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.environments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cameras TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;

-- ================================================
-- END OF SCHEMA
-- ================================================
