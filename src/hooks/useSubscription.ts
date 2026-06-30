import { useEffect, useState, useCallback } from 'react';
import { paymentService } from '@/services/payment';
import { Subscription } from '@/types/subscription';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyTransactionsCount, setMonthlyTransactionsCount] = useState(0);
  const [hasReachedTransactionLimit, setHasReachedTransactionLimit] = useState(false);

  const fetchSubscriptionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const sub = await paymentService.getSubscription();
      setSubscription(sub);
      const isUserPro = sub?.plan === 'pro' && sub?.status === 'active';
      setIsPro(isUserPro);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Obter início do mês atual em UTC
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

        // Buscar quantidade de transações criadas no mês atual
        const { count, error } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('date', startOfMonthStr);

        if (!error && count !== null) {
          setMonthlyTransactionsCount(count);
          // O limite é de 100 lançamentos para o plano gratuito
          setHasReachedTransactionLimit(!isUserPro && count >= 100);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da assinatura:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  return {
    subscription,
    isPro,
    loading,
    monthlyTransactionsCount,
    hasReachedTransactionLimit,
    refresh: fetchSubscriptionDetails
  };
}
