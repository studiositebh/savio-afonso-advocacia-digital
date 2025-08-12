import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/lovable-uploads/ea012dd9-4d66-4596-95af-836883f5642c.png" 
              alt="Sávio Afonso de Oliveira" 
              className="h-12 mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 mb-4">
              Advocacia empresarial especializada com mais de 30 anos de
              experiência no mercado jurídico.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Áreas de Atuação</Link></li>
              <li><Link to="/equipe" className="text-gray-400 hover:text-white transition-colors">Equipe</Link></li>
              <li><Link to="/projetos" className="text-gray-400 hover:text-white transition-colors">Projetos Especiais</Link></li>
              <li><Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">Painel Admin</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Áreas de Atuação</h4>
            <ul className="space-y-2">
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Econômico e Societário</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Fiscal e Tributário</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Civil Empresarial</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Trabalhista Empresarial</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Comércio Exterior</Link></li>
              <li><Link to="/areas" className="text-gray-400 hover:text-white transition-colors">Compliance e Governança</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-1 text-primary" />
                <span className="text-gray-400">
                  Rua Astolfo Rodrigues, 17<br />
                  Centro, Araxá - MG<br />
                  CEP: 38183-108
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-3 mt-1 text-primary" />
                <span className="text-gray-400">
                  +55 (34) 3438-0277<br />
                  +55 (31) 99974-0277
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-3 mt-1 text-primary" />
                <span className="text-gray-400">juridico@savioadv.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Sávio Afonso de Oliveira Advocacia Empresarial. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;