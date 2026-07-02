import { ScoreboardPage } from "@/src/components/ScoreboardPage";

type HomeProps = {
  searchParams?: Promise<{
    mode?: string | string[];
    view?: string | string[];
  }>;
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getInitialViewOnlyMode(params: {
  mode?: string | string[];
  view?: string | string[];
}) {
  const mode = getFirstParam(params.mode)?.toLowerCase();
  const view = getFirstParam(params.view)?.toLowerCase();

  if (mode === "view" || mode === "viewer" || view === "only") {
    return true;
  }

  if (mode === "admin" || view === "admin") {
    return false;
  }

  return null;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : {};

  return <ScoreboardPage initialViewOnlyMode={getInitialViewOnlyMode(params)} />;
}
