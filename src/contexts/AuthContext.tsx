// context/AuthContext.tsx
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext<{ session: Session | null; isLoading: boolean }>({ session: null, isLoading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);