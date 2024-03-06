import React, { createContext, useContext, useEffect, useState } from "react";
import { instanceAPI } from "@/services/instances";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import i18n from "@/services/i18n";
import { notifyError, notifySuccess } from "@/components/toasts/Toast";

interface IAuthProps {
  authState?: { loading: boolean; authenticated: boolean | null };
  onRegister?: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onForgot?: (email: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onExpired?: () => Promise<any>;
  user?: User | null;
  loader?: boolean;
}

const AuthContext = createContext<IAuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: ContextProps) {
  const [authState, setAuthState] = useState<{
    loading: boolean;
    authenticated: boolean | null;
  }>({ loading: true, authenticated: null });
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    const loadAuth = async () => {
      const user = await SecureStore.getItemAsync("user");
      if (user) {
        setUser(JSON.parse(user));
        setAuthState({
          loading: false,
          authenticated: true,
        });
      } else {
        setUser(null);
        setAuthState({
          loading: false,
          authenticated: false,
        });
      }
    };

    if (authState.loading) {
      loadAuth();
    }
  }, [authState.loading]);

  useEffect(() => {
    if (sessionExpired) {
      router.replace({ pathname: "/sign-in", params: { session: "expired" } });
    }
  }, [sessionExpired]);

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setLoader(true);
      const isRegister = await instanceAPI.post("/api/v1/auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      if (isRegister) {
        login(email, password);
      } else throw new Error();
    } catch (err: any) {
      if (err.request.status === 400) {
        notifyError(i18n.t("toast.register"));
      }
      if (err.request.status === 500) {
        notifyError(i18n.t("toast.error"));
      }
      setLoader(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoader(true);
      const result = await instanceAPI.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (result) {
        setAuthState({ ...authState, loading: true });
        await SecureStore.setItemAsync("user", JSON.stringify(result.data));
        router.replace("/(tabs)");
        setLoader(false);
      } else throw new Error();
    } catch (err: any) {
      if (err.request.status === 401 || err.request.status === 403) {
        notifyError(i18n.t("toast.login"));
      }
      setLoader(false);
    }
  };

  const forgot = async (email: string) => {
    try {
      setLoader(true);
      const result = await instanceAPI.post("/api/v1/auth/forgotten-password", {
        email,
      });
      if (result) {
        notifySuccess(i18n.t("toast.success.forgot"));
        setLoader(false);
      } else throw new Error();
    } catch (err: any) {
      if (err.request?.status === 500) {
        notifyError(i18n.t("toast.error"));
      }
      setLoader(false);
    }
  };

  const logout = async () => {
    try {
      const isLogout = await instanceAPI.get("/api/v1/auth/logout");
      if (isLogout) {
        setAuthState({ ...authState, loading: true });
        await SecureStore.deleteItemAsync("user");
      }
    } catch (err: any) {
      if (err.request?.status === 500) {
        notifyError(i18n.t("toast.error"));
      }
    }
  };

  const expired = async () => {
    try {
      const isExpired = await instanceAPI.get("/api/v1/auth/logout");
      if (isExpired) {
        setSessionExpired(true);
        await SecureStore.deleteItemAsync("user");
      }
    } catch (err: any) {
      if (err.request?.status === 500) {
        notifyError(i18n.t("toast.error"));
      }
    }
  };

  const value = {
    user,
    onRegister: register,
    onLogin: login,
    onForgot: forgot,
    onLogout: logout,
    onExpired: expired,
    authState,
    loader,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
