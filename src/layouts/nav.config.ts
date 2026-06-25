import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: "Tổng quan", icon: LayoutDashboard },
  { href: ROUTES.WRITINGS, label: "Bài viết", icon: FileText },
  { href: ROUTES.EXPLORE, label: "Khám phá", icon: Globe },
  { href: ROUTES.ANALYSIS, label: "Chấm bài", icon: Sparkles },
];

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
