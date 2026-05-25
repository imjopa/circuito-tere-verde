import Navbar from "@/components/layout/Navbar";

export interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  mainClassName?: string;
}

export function PageLayout({ title, subtitle, children, mainClassName }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {title && (
        <header className="bg-green-700 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-white/65">{subtitle}</p>}
          </div>
        </header>
      )}
      <main className={mainClassName ?? "mx-auto max-w-6xl px-6 py-7"}>{children}</main>
    </div>
  );
}
