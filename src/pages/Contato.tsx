import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Linkedin, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      assunto: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nome || !formData.email || !formData.telefone || !formData.assunto || !formData.mensagem) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive"
      });
      return;
    }

    // Success message
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Entraremos em contato em breve. Obrigado!"
    });

    // Reset form
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-1 bg-primary"></div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Fale com o Escritório
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entre em contato para agendar uma consulta ou obter mais informações
            sobre nossos serviços jurídicos especializados.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Informações de Contato
              </h2>
              <p className="text-gray-600 mb-8">
                Estamos à disposição para atender às suas necessidades jurídicas
                empresariais com a excelência que você merece.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Endereço</h3>
                    <p className="text-gray-600">
                      Av. Paulista, 1000, Conjunto 1010<br />
                      Bela Vista, São Paulo - SP<br />
                      CEP: 01310-100
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Telefones</h3>
                    <p className="text-gray-600">
                      +55 (11) 3456-7890<br />
                      +55 (11) 98765-4321
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">E-mail</h3>
                    <p className="text-gray-600">contato@savioafonso.adv.br</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Horário de Atendimento</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 12h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Envie sua Mensagem
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="assunto">Assunto *</Label>
                      <Select value={formData.assunto} onValueChange={handleSelectChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economico-societario">Econômico e Societário</SelectItem>
                          <SelectItem value="fiscal-tributario">Fiscal e Tributário</SelectItem>
                          <SelectItem value="civil-empresarial">Civil Empresarial</SelectItem>
                          <SelectItem value="trabalhista-empresarial">Trabalhista Empresarial</SelectItem>
                          <SelectItem value="comercio-exterior">Comércio Exterior</SelectItem>
                          <SelectItem value="compliance-governanca">Compliance e Governança</SelectItem>
                          <SelectItem value="projetos-especiais">Projetos Especiais</SelectItem>
                          <SelectItem value="outros">Outros Assuntos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        placeholder="Descreva sua necessidade jurídica..."
                        rows={5}
                        className="mt-1"
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Fale com o Escritório
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Nossa Localização
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">Mapa Interativo</p>
                <p className="text-sm">Av. Paulista, 1000 - São Paulo/SP</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contato;