import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/ielts-sheet-list.tsx"),
    route(":id", "routes/ielts-sheet-detail.tsx"),
    route("create", "routes/ielts-sheet-create.tsx"),
] satisfies RouteConfig;
