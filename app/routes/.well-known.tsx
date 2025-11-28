import type { Route } from "./+types/.well-known";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  
  // Chrome DevTools 요청을 조용히 처리
  if (url.pathname.includes("com.chrome.devtools.json")) {
    return new Response(null, { status: 404 });
  }
  
  return new Response(null, { status: 404 });
}

export default function WellKnown() {
  return null;
}

