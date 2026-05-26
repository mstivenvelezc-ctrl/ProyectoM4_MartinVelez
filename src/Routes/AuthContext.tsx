    import { createContext } from "react";

    export interface User {
    nombre: string;
    correo: string;
    }

    export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);