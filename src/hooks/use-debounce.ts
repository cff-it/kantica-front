import { useEffect, useState } from 'react';

// Retarde la propagation d'une valeur (ex. : recherche dans la liste des
// membres) pour ne pas déclencher une requête à chaque frappe.
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
