import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../services/api';
import type { CreateCardDto, UpdateCardDto } from '../types';

export const useCards = (category?: string) => {
  return useQuery({
    queryKey: ['cards', category],
    queryFn: () => cardsApi.getAll(category),
  });
};

export const useCard = (id: string) => {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: () => cardsApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardDto) => cardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardDto }) =>
      cardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

