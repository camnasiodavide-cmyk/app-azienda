import { createContext, useContext, useState } from "react";

type Ruolo = "superadmin" | "admin" | "dipendente";
type Sede = "Cosmelux" | "Indeco";

type User = {
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  sede: Sede;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}