    import { useState } from "react";
    import type { ReactNode } from "react";
    import { AuthContext } from "./AuthContext";
    import type { User } from "./AuthContext";
    import { auth } from "../firebase";
    import { signOut } from "firebase/auth";

    export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
        } catch {
        return null;
        }
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
        await signOut(auth);  // cierra sesión en Firebase
        } catch (e) {
        console.error("Error al cerrar sesión:", e);
        }
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    const actualizarTelefono = (telefono: string) => {
    if (!user) return;
    const updated = { ...user, telefono };
    setUser(updated);
    localStorage.setItem("auth_user", JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, actualizarTelefono }}>
        {children}
        </AuthContext.Provider>
    );
    }