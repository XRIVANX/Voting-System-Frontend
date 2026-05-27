// @ts-expect-error
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ---------- Types ----------
export interface User {
    id: number;
    email: string;
    name: string;
    // … any other fields from your backend
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider ----------
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });
    const [loading, setLoading] = useState(true);

    // On mount, if token exists, fetch the user profile (or decode JWT)
    useEffect(() => {
        if (token) {
            // Simulate fetching user data – replace with real API call
            // e.g. axios.get('/me', { headers: { Authorization: `Bearer ${token}` } })
            //   .then(res => setUser(res.data))
            //   .catch(() => { logout(); })
            //   .finally(() => setLoading(false));

            // For now, just set a mock user so routing works
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser({ id: 1, email: 'demo@example.com', name: 'Demo User' });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const login = async (email: string, password: string) => {
        // Replace with your real API call
        // const res = await axios.post('/login', { email, password });
        // const { token, user } = res.data;

        // Simulate login
        const mockToken = 'mock-jwt-token';
        const mockUser: User = { id: 1, email, name: 'Demo User' };

        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser(mockUser);
    };

    // @ts-ignore
    const register = async (name: string, email: string, password: string) => {
        // Replace with real registration API
        // const res = await axios.post('/register', { name, email, password });
        // Then auto-login or redirect to login

        // For now, just call login after "register"
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- Hook ----------
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}