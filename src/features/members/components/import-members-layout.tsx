import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Outlet } from 'react-router';

import type { ImportFlow } from '../hooks/use-import-flow';
import { importFileSchema, type ImportFileInput } from '../schemas';
import type { ImportPreview } from '../types';

// Layout sans chemin des écrans « Importer des membres » et « Vérification » :
// il garde le fichier choisi (le formulaire) et son aperçu d'un écran à l'autre
// (`useImportFlow`). Le rapport d'un import est hors de ce layout : en y
// arrivant, l'état du parcours est donc oublié.
export function ImportMembersLayout() {
  const form = useForm<ImportFileInput>({
    resolver: zodResolver(importFileSchema),
    // Un fichier trop gros ou d'un mauvais format est signalé dès son choix.
    mode: 'onChange',
  });
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const flow: ImportFlow = { form, preview, setPreview };

  return <Outlet context={flow} />;
}
