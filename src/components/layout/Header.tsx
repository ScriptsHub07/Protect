import Link from 'next/link';
import { ChefHat, Info, Home as HomeIcon, BookmarkCheck } from 'lucide-react'; // Changed Home to HomeIcon to avoid conflict

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ChefHat size={32} />
          <h1 className="text-2xl font-headline font-bold">Chef das Receitas</h1>
        </Link>
        <nav>
          <ul className="flex items-center gap-4 md:gap-6">
            <li>
              <Link href="/" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <HomeIcon size={18} />
                <span className="hidden sm:inline">Início</span>
              </Link>
            </li>
            <li>
              <Link href="/saved-recipes" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <BookmarkCheck size={18} />
                <span className="hidden sm:inline">Salvas</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Info size={18} />
                <span className="hidden sm:inline">Sobre</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
