import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    login as loginApi,
} from "./auth-service";

import {
    getAccessToken,
    removeAccessToken,
    saveAccessToken,
} from "./auth-storage";

export type User = {
  id: number;
  name: string;
  mobile: string;
  role: string;
  is_active?: boolean;
  flats?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    mobile: string,
    password: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * Restore authentication when application starts.
   */
  useEffect(() => {
    restoreSession();
  }, []);

const restoreSession = async () => {
  try {
    console.log("AUTH: Starting session restore...");

    const token = await getAccessToken();

    console.log(
      "AUTH: Token exists:",
      !!token
    );

    if (!token) {
      console.log(
        "AUTH: No token found"
      );

      setUser(null);
      return;
    }

    console.log(
      "AUTH: Calling /auth/me..."
    );

    const currentUser = await getCurrentUser();

    console.log(
      "AUTH: /auth/me success:",
      currentUser
    );

    setUser(currentUser);

  } catch (error: any) {

    console.log(
      "AUTH: Session restore FAILED"
    );

    console.log(
      "AUTH ERROR:",
      error?.response?.status
    );

    console.log(
      "AUTH ERROR DATA:",
      error?.response?.data
    );

    console.log(
      "AUTH ERROR MESSAGE:",
      error?.message
    );

    await removeAccessToken();

    setUser(null);

  } finally {
    console.log(
      "AUTH: Restore finished"
    );

    setLoading(false);
  }
};

  /*
   * Login
   */
  const login = async (
    mobile: string,
    password: string
  ) => {
    const result = await loginApi(
      mobile,
      password
    );

    await saveAccessToken(
      result.access_token
    );

    setUser(result.user);

    return result.user;
  };

  /*
   * Logout
   */
  const logout = async () => {
    await removeAccessToken();

    setUser(null);
  };

  /*
   * Refresh user from backend.
   */
  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (error) {
      console.log(
        "Failed to refresh user:",
        error
      );

      await removeAccessToken();

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}