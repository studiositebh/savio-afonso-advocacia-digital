import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAISubscription } from '@/hooks/useAISubscription';
import { AIPlansModal } from '@/components/admin/AIPlansModal';
import { Sparkles, Calendar, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

export default function Subscription() {
  const { subscription, usage, plans, loading, hasActiveSubscription, getCreditsRemaining } = useAISubscription();
  const [showPlansModal, setShowPlansModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getUsagePercentage = () => {
    if (!subscription || !usage) return 0;
    return (usage.used_credits / subscription.ai_plans.monthly_credits) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Assinatura IA
        </h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura de geração de conteúdo com IA
        </p>
      </div>

      {hasActiveSubscription() && subscription ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Plano Atual
                <Badge variant="default">Ativo</Badge>
              </CardTitle>
              <CardDescription>
                {subscription.ai_plans.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Valor mensal</span>
                <span className="text-xl font-bold">
                  {formatPrice(subscription.ai_plans.price_brl)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Posts incluídos</span>
                <span className="font-medium">
                  {subscription.ai_plans.monthly_credits}/mês
                </span>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => setShowPlansModal(true)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Fazer upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Uso do Período
              </CardTitle>
              <CardDescription>
                Créditos consumidos neste ciclo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilizados: {usage?.used_credits || 0}</span>
                  <span>Restantes: {getCreditsRemaining()}</span>
                </div>
                <Progress value={getUsagePercentage()} className="h-3" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Renova em {formatDate(subscription.current_period_end)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Gerenciar Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para gerenciar sua assinatura (alterar forma de pagamento, cancelar, etc.), 
                configure a integração com Stripe e acesse o portal de cobrança.
              </p>
              <Button variant="outline" disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Gerenciar pagamento (Stripe não configurado)
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Nenhuma assinatura ativa
            </CardTitle>
            <CardDescription>
              Você ainda não possui uma assinatura do recurso de IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Com uma assinatura, você pode gerar posts completos otimizados para SEO 
              em poucos minutos, economizando tempo na produção de conteúdo.
            </p>
            <Button onClick={() => setShowPlansModal(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Ver planos disponíveis
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Benefícios Incluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Posts otimizados para SEO',
              'Meta title e description',
              'Estrutura com H2/H3',
              'Seção de FAQs automática',
              'Slug amigável gerado',
              'CTA personalizado',
              'Disclaimer jurídico incluso',
              'Até 5 regenerações por post',
              'Suporte por email',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AIPlansModal
        open={showPlansModal}
        onOpenChange={setShowPlansModal}
        reason="no_subscription"
      />
    </div>
  );
}
