import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { navMessages } from "@/messages/nav";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: navMessages.dashboard, icon: LayoutDashboard },
  { href: ROUTES.WRITINGS, label: navMessages.writings, icon: FileText },
  { href: ROUTES.EXPLORE, label: navMessages.explore, icon: Globe },
  { href: ROUTES.ANALYSIS, label: navMessages.analysis, icon: Sparkles },
];

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
