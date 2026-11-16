const STORAGE_KEY = 'kantica-token';

// Copie en mémoire : si le stockage du navigateur est indisponible (navigation
// privée, quota), la session reste utilisable jusqu'au rechargement.
let memoryToken: string | null = null;

// Jeton Bearer Sanctum reçu à la connexion ou à l'inscription.
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryToken;
  } catch {
    return memoryToken;
  }
}

export function setAuthToken(token: string): void {
  memoryToken = token;

  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Stockage indisponible : le jeton en mémoire suffit.
  }
}

export function clearAuthToken(): void {
  memoryToken = null;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à effacer si le stockage est indisponible.
  }
}
