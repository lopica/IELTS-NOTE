import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/ielts-note-landing-page.tsx"),
  // route("test", "routes/test.tsx"),
  layout("./components/layout.tsx", [
    route("list", "routes/ielts-sheet-list.tsx"),
    layout("./components/create-layout.tsx", [
      route("list/create", "routes/ielts-sheet-create.tsx"),
    ]),
    layout("./components/detail-layout.tsx", [
      route("list/:id", "routes/ielts-sheet-detail.tsx"),
    ]),
    // layout("./components/edit-layout.tsx", [
    //   route("list/:id/:version", "routes/ielts-sheet-create-version.tsx"),
    // ]),
  ]),
] satisfies RouteConfig;
