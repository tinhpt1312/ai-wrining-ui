import { navMessages, routeLabels } from "@/messages/nav";

export type LayoutWidth = "default" | "wide" | "full";

export const LAYOUT_WIDTH_CLASSES: Record<LayoutWidth, string> = {
  default: "mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8",
  wide: "mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8",
  full: "w-full px-3 py-2 lg:px-5 lg:py-3",
};

/** Infer content width from route — pages can override via LayoutProvider. */
export function resolveLayoutWidth(pathname: string): LayoutWidth {
  if (pathname.includes("/revise")) return "full";

  if (
    pathname.includes("/journey") ||
    pathname.includes("/edit") ||
    /\/analysis\/[^/]+$/.test(pathname)
  ) {
    return "wide";
  }

  if (/\/writings\/[^/]+$/.test(pathname) && !pathname.endsWith("/new")) {
    return "wide";
  }

  return "default";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function resolveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: navMessages.dashboard }];

  const items: BreadcrumbItem[] = [];
  let path = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    path += `/${segment}`;

    const label = routeLabels[segment];
    if (!label) continue;

    const isLast = i === segments.length - 1;
    items.push({
      label,
      href: isLast ? undefined : path,
    });
  }

  return items.length > 0
    ? items
    : [{ label: navMessages.dashboard, href: "/dashboard" }];
}
