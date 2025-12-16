import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AISubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  ai_plans: {
    id: string;
    name: string;
    monthly_credits: number;
    price_brl: number;
  };
}

interface AIUsage {
  id: string;
  used_credits: number;
  period_start: string;
  period_end: string;
}

interface AIPlan {
  id: string;
  name: string;
  monthly_credits: number;
  price_brl: number;
  active: boolean;
}

export function useAISubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<AISubscription | null>(null);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [plans, setPlans] = useState<AIPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      // Buscar planos
      const { data: plansData } = await supabase
        .from('ai_plans')
        .select('*')
        .eq('active', true)
        .order('price_brl');

      setPlans(plansData || []);

      // Buscar assinatura ativa
      const { data: subData } = await supabase
        .from('ai_subscriptions')
        .select('*, ai_plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .single();

      setSubscription(subData as AISubscription | null);

      // Buscar ou criar uso
      if (subData) {
        let { data: usageData } = await supabase
          .from('ai_usage')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!usageData) {
          // Criar registro de uso
          const { data: newUsage } = await supabase
            .from('ai_usage')
            .insert({
              user_id: user.id,
              period_start: subData.current_period_start,
              period_end: subData.current_period_end,
              used_credits: 0
            })
            .select()
            .single();
          
          usageData = newUsage;
        }

        // Verificar se precisa resetar (novo período)
        if (usageData && new Date(usageData.period_end) < new Date()) {
          const { data: resetUsage } = await supabase
            .from('ai_usage')
            .update({
              used_credits: 0,
              period_start: subData.current_period_start,
              period_end: subData.current_period_end,
              last_reset_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single();
          
          usageData = resetUsage;
        }

        setUsage(usageData as AIUsage | null);
      }
    } catch (error) {
      console.error('Error fetching AI subscription data:', error);
    }

    setLoading(false);
  };

  const hasActiveSubscription = () => {
    return subscription !== null && subscription.status === 'active';
  };

  const getCreditsRemaining = () => {
    if (!subscription || !usage) return 0;
    return Math.max(0, subscription.ai_plans.monthly_credits - usage.used_credits);
  };

  const canPublish = () => {
    return hasActiveSubscription() && getCreditsRemaining() > 0;
  };

  const consumeCredit = async () => {
    if (!user || !usage) return false;

    const { error } = await supabase
      .from('ai_usage')
      .update({ used_credits: usage.used_credits + 1 })
      .eq('user_id', user.id);

    if (!error) {
      setUsage(prev => prev ? { ...prev, used_credits: prev.used_credits + 1 } : null);
      return true;
    }
    return false;
  };

  const refreshData = () => {
    fetchData();
  };

  return {
    subscription,
    usage,
    plans,
    loading,
    hasActiveSubscription,
    getCreditsRemaining,
    canPublish,
    consumeCredit,
    refreshData
  };
}
