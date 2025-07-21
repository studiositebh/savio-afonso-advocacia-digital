import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/ea012dd9-4d66-4596-95af-836883f5642c.png" 
              alt="Sávio Afonso de Oliveira" 
              className="h-12 w-auto"
            />
          </Link>
        </div>
        
        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none py-4 md:py-0 px-4 md:px-0 z-50`}>
          <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
            Início
          </Link>
          <Link to="/sobre" className="text-foreground hover:text-primary font-medium transition-colors">
            Sobre
          </Link>
          <Link to="/areas" className="text-foreground hover:text-primary font-medium transition-colors">
            Áreas de Atuação
          </Link>
          <Link to="/equipe" className="text-foreground hover:text-primary font-medium transition-colors">
            Equipe
          </Link>
          <Link to="/noticias" className="text-foreground hover:text-primary font-medium transition-colors">
            Notícias
          </Link>
          <Link to="/artigos" className="text-foreground hover:text-primary font-medium transition-colors">
            Artigos
          </Link>
          <Link to="/projetos" className="text-foreground hover:text-primary font-medium transition-colors">
            Projetos Especiais
          </Link>
          <Link to="/contato" className="text-foreground hover:text-primary font-medium transition-colors">
            Contato
          </Link>
        </nav>
        
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;