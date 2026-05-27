    import { createContext } from "react";

    export interface User {
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;
    foto?: string;        // foto de perfil (Google)
    proveedor?: string;   // "email" | "google"
    }

    export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);