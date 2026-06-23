import Header from "./Header";
import Footer from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="app-main flex-1 flex flex-col">
        <div className="app-main-inner container mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
