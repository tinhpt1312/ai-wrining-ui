import { SharePageShell } from "@/features/share";

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharePageShell>{children}</SharePageShell>;
}
