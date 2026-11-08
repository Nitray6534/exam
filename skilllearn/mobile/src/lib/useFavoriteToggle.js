import { useCallback } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/ui';

// Toggle favorit dengan optimistic update.
export function useFavoriteToggle(setItems, { removeOnUnfavorite = false } = {}) {
  const toast = useToast();
  return useCallback(
    async (material) => {
      const next = !material.isFavorite;
      const apply = (fav) =>
        setItems((items) =>
          removeOnUnfavorite && !fav
            ? items.filter((m) => m.id !== material.id)
            : items.map((m) => (m.id === material.id ? { ...m, isFavorite: fav } : m))
        );
      apply(next);
      try {
        if (next) await api.addFavorite(material.id);
        else await api.removeFavorite(material.id);
        toast(next ? 'Disimpan ke favorit' : 'Dihapus dari favorit');
      } catch (err) {
        if (!removeOnUnfavorite) apply(!next);
        toast(err.message, 'error');
      }
    },
    [setItems, toast, removeOnUnfavorite]
  );
}
