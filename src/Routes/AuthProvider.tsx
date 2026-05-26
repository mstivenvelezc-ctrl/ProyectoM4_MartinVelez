    import { useState } from "react";
    import type { ReactNode } from "react";
    import { AuthContext } from "./AuthContext";
    import type { User } from "./AuthContext";

    export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
        } catch {
        return null;
        }
    });

    const login = (userData: User, password?: string) => {
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Guarda el usuario en la lista de usuarios registrados
    if (password) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");
        const yaExiste = usuarios.find((u: User & { password: string }) => u.correo === userData.correo);
        if (!yaExiste) {
            usuarios.push({ ...userData, password });
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
        }
    }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user"); 
        
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }