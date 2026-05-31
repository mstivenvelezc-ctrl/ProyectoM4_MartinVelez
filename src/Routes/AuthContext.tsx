    import { createContext } from "react";

    export interface User {
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;
    telefono?:  string;   // para alertas de WhatsApp
    foto?: string;        // foto de perfil (Google)
    proveedor?: string;   // "email" | "google"
    }

    export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    actualizarTelefono: (telefono: string) => void;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);