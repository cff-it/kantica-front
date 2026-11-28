import { useRef } from 'react';
import { useBlocker } from 'react-router';

// Bloque la navigation interne tant que `hasUnsavedChanges` est vrai : lien,
// onglet, bouton « Annuler » ou geste « retour » d'un long formulaire, dont la
// saisie serait perdue sans prévenir. Le routeur passe alors le `blocker` à
// l'état `blocked` ; l'écran affiche une confirmation (`UnsavedChangesDialog`)
// qui appelle `blocker.proceed()` ou `blocker.reset()`.
//
// Un changement de page seulement : modifier l'adresse sans quitter l'écran
// (paramètres) ne bloque pas. `allowLeaving()` est à appeler juste avant une
// sortie voulue, comme la fin d'un enregistrement réussi, dont le formulaire
// reste « modifié » tant qu'il n'est pas réinitialisé.
//
// Ne couvre pas la fermeture ou le rechargement de l'onglet du navigateur.
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  const isLeavingAllowed = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      !isLeavingAllowed.current &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const allowLeaving = () => {
    isLeavingAllowed.current = true;
  };

  return { blocker, allowLeaving };
}
