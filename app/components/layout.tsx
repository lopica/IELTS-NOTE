import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Outlet, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

const capitalize = (str: string) =>
  decodeURIComponent(str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " "));

const Layout = () => {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean); 

  const buildHref = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <>
      <header className="px-12 py-4 flex justify-end items-center gap-8 bg-white">
        <Switch />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </header>
      <div className="pt-20 px-28">
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
