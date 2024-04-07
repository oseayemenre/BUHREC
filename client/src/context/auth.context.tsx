"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ILoginData, ILoginDatadata } from "@/app/(auth)/auth/page";
import { useProfile } from "@/hooks/useProfile";

type TChildren = React.ReactNode;

interface IUser {
  user?: (ILoginDatadata & ILoginData) | null;
  setUser: Dispatch<SetStateAction<(ILoginDatadata & ILoginData) | null>>;
}

const AuthContext = createContext<IUser | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("Context can only be used within a react component");

  return context;
};

const AuthContextProvider = ({ children }: { children: TChildren }) => {
  const { profile } = useProfile();

  const [user, setUser] = useState<(ILoginData & ILoginDatadata) | null>(
    profile as ILoginData & ILoginDatadata
  );

  useEffect(() => {
    if (profile) {
      setUser(profile as ILoginData & ILoginDatadata);
    }
  }, [profile]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
