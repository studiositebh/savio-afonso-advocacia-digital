import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown, MessageCircle } from 'lucide-react';
import { useAISubscription } from '@/hooks/useAISubscription';

interface AIPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: 'no_subscription' | 'no_credits';
}

const planIcons: Record<string, React.ReactNode> = {
  'Essencial': <Sparkles className="h-6 w-6" />,
  'Profissional': <Zap className="h-6 w-6" />,
  'Ilimitado': <Crown className="h-6 w-6" />,
};

const planColors: Record<string, string> = {
  'Essencial': 'border-blue-200 bg-blue-50/50',
  'Profissional': 'border-purple-200 bg-purple-50/50',
  'Ilimitado': 'border-amber-200 bg-amber-50/50',
};

const benefits = [
  'Conteúdo otimizado para SEO',
  'Estrutura escaneável com H2/H3',
  'Meta title e description gerados',
  'Seção de FAQs automática',
  'Slug otimizado',
  'CTA personalizado',
  'Disclaimer jurídico incluído',
];

export function AIPlansModal({ open, onOpenChange, reason }: AIPlansModalProps) {
  const { plans, subscription, getCreditsRemaining } = useAISubscription();

  const handleSubscribe = (planId: string) => {
    // Por enquanto, apenas fechar modal e avisar que precisa configurar Stripe
    alert('Para ativar a assinatura, configure a integração com Stripe. Por enquanto, entre em contato com o suporte.');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Recurso Premium: Notícias com IA
          </DialogTitle>
          <DialogDescription className="text-base">
            {reason === 'no_credits' 
              ? 'Seus créditos do mês acabaram. Faça upgrade ou aguarde a renovação.'
              : 'Gere posts prontos, revisados para leitura e SEO, em minutos.'}
          </DialogDescription>
        </DialogHeader>

        {subscription && reason === 'no_credits' && (
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Plano atual:</strong> {subscription.ai_plans.name} | 
              <strong> Créditos restantes:</strong> {getCreditsRemaining()} | 
              <strong> Renova em:</strong> {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${planColors[plan.name] || 'border-border'} ${
                plan.name === 'Profissional' ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.name === 'Profissional' && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                  Mais popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 p-3 rounded-full bg-background shadow-sm">
                  {planIcons[plan.name]}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.monthly_credits} posts/mês
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(plan.price_brl)}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <Button 
                  className="w-full" 
                  variant={plan.name === 'Profissional' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscription?.plan_id === plan.id}
                >
                  {subscription?.plan_id === plan.id ? 'Plano atual' : 'Contratar agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <h4 className="font-semibold mb-3">O que está incluído:</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="link" className="text-muted-foreground">
            <MessageCircle className="h-4 w-4 mr-2" />
            Falar com suporte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
