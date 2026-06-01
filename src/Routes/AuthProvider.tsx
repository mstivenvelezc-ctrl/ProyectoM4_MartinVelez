    import { useState } from "react";
    import type { ReactNode } from "react";
    import { AuthContext } from "./AuthContext";
    import type { User } from "./AuthContext";
    import { auth } from "../firebase";
    import { signOut } from "firebase/auth";

    const SESSION_KEY = "auth_user";
    const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 horas en ms

    interface StoredSession {
    user: User;
    exp: number; // timestamp de expiración
    }

    function loadSession(): User | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;

        const session: StoredSession = JSON.parse(raw);

        // Si la sesión expiró, limpiarla y retornar null
        if (Date.now() > session.exp) {
        localStorage.removeItem(SESSION_KEY);
        return null;
        }

        return session.user;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
    }

    function saveSession(userData: User): void {
    const session: StoredSession = {
        user: userData,
        exp:  Date.now() + SESSION_TTL,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => loadSession());

    const login = (userData: User) => {
        setUser(userData);
        saveSession(userData);
    };

    const logout = async () => {
        try {
        await signOut(auth);
        } catch (e) {
        console.error("Error al cerrar sesión:", e);
        }
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }