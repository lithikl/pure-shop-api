import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
  /** Scope the page (and navbar) to the dark NOIRKNULL theme. */
  dark?: boolean;
}

export default function Layout({ children, showHero = false, dark = false }: LayoutProps) {
  return (
    <div className={`min-h-screen ${dark ? 'dark bg-background text-foreground' : ''}`}>
      <Navbar />
      <main className={showHero ? '' : 'pt-14'}>{children}</main>
    </div>
  );
}
