import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type UserProfile = 'school' | 'admin';

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  school_id?: string | null;
  user_type?: 'admin' | 'school';
}

interface UserProfileContextType {
  currentProfile: UserProfile;
  setCurrentProfile: (profile: UserProfile) => void;
  profile: UserData;
  setProfile: (profile: UserData) => void;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Default user data while loading
const defaultUserData: UserData = {
  name: 'Usuário',
  email: '',
  role: 'Carregando...',
  school_id: null,
  user_type: 'school',
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile>('school');
  const [profile, setProfile] = useState<UserData>(defaultUserData);

  // Function to fetch user profile from Supabase
  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, email, user_type, school_id, avatar_url')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user profile:', userError);
        return;
      }

      // Map database data to UserData interface
      const mappedProfile: UserData = {
        name: userData.full_name || userData.email,
        email: userData.email,
        avatar: userData.avatar_url || undefined,
        role: userData.user_type === 'admin'
          ? 'Administrador do Sistema'
          : 'Administrador da Escola',
        school_id: userData.school_id,
        user_type: userData.user_type,
      };

      setProfile(mappedProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // NÃO buscar automaticamente no mount
  // O perfil será buscado apenas quando refreshProfile() for chamado explicitamente
  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  // Update profile data when currentProfile changes
  const handleSetCurrentProfile = (newProfile: UserProfile) => {
    setCurrentProfile(newProfile);
  };

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  return (
    <UserProfileContext.Provider value={{
      currentProfile,
      setCurrentProfile: handleSetCurrentProfile,
      profile,
      setProfile,
      refreshProfile
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
