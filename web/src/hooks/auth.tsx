import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';

// utils, services, hooks
import api from '../services/api';

// interfaces
interface AuthState {
  token: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

interface SignInCredentials {
  token: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

interface AuthContextData {
  token: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@ContactMi:token');
    const userJson = localStorage.getItem('@ContactMi:user');

    const state = {} as AuthState;

    if (token) {
      state.token = token;

      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    if (userJson) {
      state.user = JSON.parse(userJson);
    }

    return state;
  });

  const signIn = useCallback(
    async ({ token, user }: SignInCredentials): Promise<void> => {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setData({ token, user } as AuthState);

      history.push('/');

      localStorage.setItem('@ContactMi:token', token);
      localStorage.setItem('@ContactMi:user', JSON.stringify(user));
    },
    [history],
  );

  const signOut = useCallback(() => {
    api.defaults.headers.Authorization = undefined;

    setData({} as AuthState);

    localStorage.removeItem('@ContactMi:token');
    localStorage.removeItem('@ContactMi:user');
  }, []);

  useEffect(() => {
    const id = api.interceptors.response.use(value => {
      if (value.status === 401) {
        signOut();
      }
      return value;
    });

    return () => {
      api.interceptors.response.eject(id);
    };
  }, [data, signOut]);

  return (
    <AuthContext.Provider
      value={{
        token: data.token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
