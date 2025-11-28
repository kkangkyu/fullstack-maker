import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    route(".well-known/:path*", "routes/.well-known.tsx"),
] satisfies RouteConfig;
