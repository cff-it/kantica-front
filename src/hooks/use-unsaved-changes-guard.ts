import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router';

// Bloque la navigation interne tant que `hasUnsavedChanges` est vrai : lien,
// onglet, bouton « Annuler » ou geste « retour » d'un long formulaire, dont la
// saisie serait perdue sans prévenir. Le routeur passe alors le `blocker` à
// l'état `blocked` ; l'écran affiche une confirmation (`UnsavedChangesDialog`)
// qui appelle `blocker.proceed()` ou `blocker.reset()`.
//
// Un changement de page seulement : modifier l'adresse sans quitter l'écran
// (paramètres) ne bloque pas. `leaveWithoutConfirmation(navigateAway)` sert à
// une sortie voulue, comme la fin d'un enregistrement réussi, dont le
// formulaire reste « modifié » tant qu'il n'est pas réinitialisé : la garde est
// levée le temps d'appeler `navigateAway` (le routeur évalue la garde dans
// l'appel même de `navigate`), puis aussitôt réarmée. Si l'écran reste monté
// (navigation sans effet), la saisie suivante reste donc protégée.
//
// Fermer ou recharger l'onglet quitte l'application sans passer par le
// routeur : un écouteur `beforeunload` (posé tant que la saisie n'est pas
// enregistrée, retiré ensuite) fait alors demander confirmation par le
// navigateur, avec son propre texte. Sur mobile, les navigateurs l'appellent
// peu (iOS Safari l'ignore, et une page mise en veille puis supprimée par le
// système ne reçoit aucun événement) : la saisie y reste fragile.
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  const isLeavingAllowed = useRef(false);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const confirmBeforeUnload = (event: BeforeUnloadEvent) => {
      // Une sortie voulue (`leaveWithoutConfirmation`) ne demande rien.
      if (!isLeavingAllowed.current) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', confirmBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', confirmBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      !isLeavingAllowed.current &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const leaveWithoutConfirmation = (navigateAway: () => void) => {
    isLeavingAllowed.current = true;

    try {
      navigateAway();
    } finally {
      isLeavingAllowed.current = false;
    }
  };

  return { blocker, leaveWithoutConfirmation };
}
