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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }