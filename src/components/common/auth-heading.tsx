type AuthHeadingProps = {
  title: string;
  description?: string;
};

// Titre des écrans publics (inscription, connexion) : Cormorant Garamond via
// le style de `h1`, description en gris Ardoise.
export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <header className="space-y-3 pt-8">
      <h1 className="text-4xl leading-tight">{title}</h1>
      {description ? (
        <p className="text-lg text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
