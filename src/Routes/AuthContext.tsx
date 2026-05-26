    import { createContext } from "react";

    export interface User {
    nombre: string;
    apellido: string;
    edad: number;
    correo: string;
    }

    export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, password?: string) => void;
    logout: () => void;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);