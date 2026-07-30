import { Footer } from "./footer";
import { Header } from "./header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
