import type { Route } from "./+types/home-page";

export function loader({}: Route.LoaderArgs) {
  return { greeting: "Welcome to wemake" };
}

export function action({}: Route.ActionArgs) {
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "wemake • Home" },
    { name: "description", content: "wemake home experience" },
  ];
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 py-16">
      <h1 className="text-3xl font-semibold">{loaderData.greeting}</h1>
      <p className="text-muted-foreground">
        Build full-stack products end to end with wemake.
      </p>
    </main>
  );
}

