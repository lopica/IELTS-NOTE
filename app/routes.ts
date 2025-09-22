import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/ielts-note-landing-page.tsx"),
  route("test", "routes/test.tsx"),
  layout("./components/layout.tsx", [
    route("list", "routes/ielts-sheet-list.tsx"),
    layout("./components/create-layout.tsx", [
      route("create", "routes/ielts-sheet-create.tsx"),
    ]),
    layout("./components/detail-layout.tsx", [
      route("list/:id", "routes/ielts-sheet-detail.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
