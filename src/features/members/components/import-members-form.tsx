import { Link, useNavigate } from 'react-router';
import { useFormState, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { applyServerErrors } from '@/lib/form-errors';
import { paths } from '@/lib/paths';

import { useImportFlow } from '../hooks/use-import-flow';
import { usePreviewMemberImport } from '../hooks/use-preview-member-import';
import { ImportActionBar } from './import-action-bar';
import { ImportFileCard } from './import-file-card';
import { ImportTemplateCard } from './import-template-card';

const FORM_ID = 'import-members-form';

// Première étape de l'import (maquette 08) : les deux cartes (modèle, fichier)
// et le bouton « Vérifier le fichier ». Le bouton est hors du `<form>` (la
// barre d'actions est fixe sur mobile) et le soumet par son attribut `form`.
// Le back lit le fichier sans rien écrire ; l'aperçu est gardé dans le layout
// pour l'écran de vérification.
export function ImportMembersForm() {
  const { form, setPreview } = useImportFlow();
  const navigate = useNavigate();
  const preview = usePreviewMemberImport();
  const file: File | undefined = useWatch({
    control: form.control,
    name: 'file',
  });
  // Le schéma refuse le fichier (extension, taille) : l'erreur est déjà sous la
  // zone de dépôt, le bouton attend un autre fichier.
  const { isValid } = useFormState({ control: form.control });

  const onSubmit = form.handleSubmit((values) =>
    preview.mutate(values.file, {
      onSuccess: (result) => {
        setPreview(result);
        void navigate(paths.membersImportReview);
      },
      onError: (error) => {
        // 422 : le motif du back s'affiche sous la zone de dépôt.
        if (!applyServerErrors(error, form.setError)) {
          toast.error('Vérification impossible. Réessayez dans un instant.');
        }
      },
    }),
  );

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={onSubmit}
        noValidate
        className="grid gap-5 lg:grid-cols-2"
      >
        <ImportTemplateCard />
        <ImportFileCard />
      </form>
      <div className="mt-5 lg:mt-6">
        <ImportActionBar>
          <ActionButton
            asChild
            variant="ghost"
            className="hidden text-muted-foreground lg:inline-flex lg:h-12 lg:w-auto"
          >
            <Link to={paths.members}>Annuler</Link>
          </ActionButton>
          <ActionButton
            type="submit"
            form={FORM_ID}
            loading={preview.isPending}
            disabled={!file || !isValid}
            className="lg:h-12 lg:w-auto"
          >
            Vérifier le fichier
          </ActionButton>
        </ImportActionBar>
      </div>
    </>
  );
}
