import { Outlet } from 'react-router';

// Layout des écrans publics (connexion, inscription, compte en attente).
// L'icône simplifiée de la charte (C bleu, point rouge) est dessinée en CSS :
// le logo officiel n'est pas encore fourni sous forme de fichier.
export function AuthLayout() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-12">
      <div className="flex flex-col items-center gap-3 pb-10 text-center">
        <span
          aria-hidden
          className="relative flex size-20 items-center justify-center rounded-2xl bg-primary font-heading text-5xl font-semibold text-primary-foreground"
        >
          C
          <span className="absolute bottom-3 right-3 size-3 rounded-full bg-brand-red" />
        </span>
        <p className="font-heading text-xl font-semibold tracking-wide text-link">
          Chorale Francophone Faravohitra
        </p>
      </div>

      <Outlet />
    </main>
  );
}
