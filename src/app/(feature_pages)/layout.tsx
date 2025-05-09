import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <section>
      <Navbar />
      <main className="min-h-[calc(100vh-96px)]">{children}</main>
    </section>
  );
}
