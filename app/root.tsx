import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import Navigation from "./common/components/navigation";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Chrome 확장 프로그램 에러 필터링 함수
                function isChromeExtensionError(value) {
                  if (!value) return false;
                  
                  const valueString = typeof value === 'string' 
                    ? value 
                    : (value.message || value.stack || JSON.stringify(value) || '');
                  
                  // 객체 속성 확인 (content.js 에러 객체)
                  if (typeof value === 'object') {
                    if (
                      (value.code === 403 && value.httpError === false) ||
                      (value.name === 'i' && value.code === 403) ||
                      value.pathPrefix === '/site_integration' ||
                      value.path === '/template_list'
                    ) {
                      return true;
                    }
                  }
                  
                  return (
                    valueString.includes('chrome-extension://') ||
                    valueString.includes('content.js') ||
                    valueString.includes('background.js') ||
                    valueString.includes('site_integration') ||
                    valueString.includes('template_list') ||
                    valueString.includes('permission error') ||
                    valueString.includes('com.chrome.devtools')
                  );
                }
                
                // console.error 필터링
                const originalError = window.console.error;
                window.console.error = function(...args) {
                  if (args.some(isChromeExtensionError)) {
                    return; // 조용히 무시
                  }
                  originalError.apply(console, args);
                };
                
                // console.warn 필터링
                const originalWarn = window.console.warn;
                window.console.warn = function(...args) {
                  if (args.some(isChromeExtensionError)) {
                    return; // 조용히 무시
                  }
                  originalWarn.apply(console, args);
                };
                
                // 전역 에러 핸들러
                window.addEventListener('error', function(event) {
                  if (
                    isChromeExtensionError(event.message) ||
                    isChromeExtensionError(event.error) ||
                    (event.filename && event.filename.includes('content.js')) ||
                    (event.filename && event.filename.includes('chrome-extension://'))
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Unhandled promise rejection 핸들러
                window.addEventListener('unhandledrejection', function(event) {
                  if (isChromeExtensionError(event.reason)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Chrome DevTools의 .well-known 요청을 조용히 처리
  if (
    isRouteErrorResponse(error) &&
    error.status === 404 &&
    typeof window !== "undefined" &&
    window.location.pathname.includes(".well-known")
  ) {
    return null;
  }

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
