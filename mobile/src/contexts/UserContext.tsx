import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import KEYS from '../constants/keys';

import api from '../services/api';

interface UserInformations {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface UserState {
  token: string;
  user: UserInformations;
}

interface SignInCredentials {
  token: string;
  user: UserInformations;
}

interface UserContextData {
  token: string;
  user: UserInformations;
  registerUser(credentials: SignInCredentials): Promise<void>;
  unregisterUser(): Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC = ({ children }) => {
  /**
   * Saves user data, like token, id, name, surname and email
   */
  const [data, setData] = useState<UserState>({} as UserState);

  /**
   * Try to load user informations from storage
   */
  const loadData = useCallback(async () => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    const userJson = await AsyncStorage.getItem(KEYS.USER);

    // Check if informations exists in storage
    if (token && userJson) {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // Fill state
      setData({
        token,
        user: JSON.parse(userJson),
      });
    }
  }, []);

  /**
   * Register user in state, axios headers and storage
   */
  const registerUser = useCallback(
    async ({ token, user }: SignInCredentials): Promise<void> => {
      // Add a default Authorization header to axios with the token
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // Fill state
      setData({ token, user } as UserState);

      // Add token and user informations in storage
      await AsyncStorage.setItem(KEYS.TOKEN, token);
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    },
    [],
  );

  /**
   * Unregister user in state, axios headers and storage
   */
  const unregisterUser = useCallback(async () => {
    // Remove default Authorization header
    api.defaults.headers.Authorization = undefined;

    // Clear state
    setData({} as UserState);

    // Remove token and user informations from storage
    await AsyncStorage.removeItem(KEYS.TOKEN);
    await AsyncStorage.removeItem(KEYS.USER);
  }, []);

  /**
   * Creates a axios interceptor to check if the request response returns
   * a 401 (Unauthorized) http code to execute logout flow
   */
  useEffect(() => {
    const id = api.interceptors.response.use(value => {
      // If API returns a Unauthorized code, unregister the user
      if (value.status === 401) {
        unregisterUser();
      }

      return value;
    });

    // Remove interceptor when component unmount
    return () => {
      api.interceptors.response.eject(id);
    };
  }, [unregisterUser]);

  /**
   * Try to load user informations from storage
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <UserContext.Provider
      value={{
        token: data.token,
        user: data.user,
        registerUser,
        unregisterUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextData => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }

  return context;
};
