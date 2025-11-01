import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, RegisterCredentials } from '../types';

export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

