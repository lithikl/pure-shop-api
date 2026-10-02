import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

export default function Layout({ children, showHero = false }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={showHero ? '' : 'pt-14'}>{children}</main>
    </div>
  );
}
