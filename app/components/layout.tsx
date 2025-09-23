import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import type { Route } from "../+types/root";
import { Button } from "./ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

const capitalize = (str: string) => {
  // decode the segment so spaces become spaces
  const decoded = decodeURIComponent(str);
  // capitalize first letter + replace dashes with space (if any)
  return decoded.charAt(0).toUpperCase() + decoded.slice(1).replace(/-/g, " ");
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // split pathname to segments (these will be decoded automatically by browser)
  const segments = location.pathname.split("/").filter(Boolean);

  // build href by re-encoding the segments to keep %20 etc
  const buildHref = (index: number) => {
  return "/" + segments.slice(0, index + 1).join("/");
};

  return (
    <>
      {/* your header code */}
      <div className="pt-20 md:px-28">
        <Button
          variant={"link"}
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline py-8"
        >
          ← Back
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = buildHref(index);
              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>
                        {capitalize(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <Outlet />
      </div>
    </>
  );
};


export default Layout;
