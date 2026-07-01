import { createClient } from '@/lib/supabase/client';
import { Subscription, PlanType, SubscriptionStatus } from '@/types/subscription';

const supabase = createClient();

export const paymentService = {
  /**
   * Obtém a assinatura ativa do usuário logado.
   * Se nenhuma existir, cria uma assinatura com plano gratuito.
   */
  async getSubscription(): Promise<Subscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Tenta buscar assinatura existente
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar assinatura:', error);
        return null;
      }

      if (data) {
        const sub = data as Subscription;
        
        // Verifica se a assinatura PRO venceu (passou da data de renovação)
        if (sub.plan === 'pro' && sub.status === 'active' && sub.next_billing_date) {
          const nextBilling = new Date(sub.next_billing_date);
          const now = new Date();
          if (now > nextBilling) {
            // Venceu! Atualiza no banco para status inativo
            const { data: updated, error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'inactive' as SubscriptionStatus,
                updated_at: now.toISOString()
              })
              .eq('user_id', user.id)
              .select('*')
              .single();

            if (!updateError && updated) {
              return updated as Subscription;
            }
          }
        }
        return sub;
      }

      // Se não existir, cria a gratuita por segurança (upsert evita duplicate key)
      const newSub = {
        user_id: user.id,
        plan: 'free' as PlanType,
        status: 'active' as SubscriptionStatus,
        started_at: new Date().toISOString()
      };

      const { data: created, error: insertError } = await supabase
        .from('subscriptions')
        .upsert(newSub, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (insertError) {
        console.error('Erro ao criar assinatura padrão:', insertError);
        return null;
      }

      return created as Subscription;
    } catch (err) {
      console.error('Erro no paymentService.getSubscription:', err);
      return null;
    }
  },

  /**
   * Registra a solicitação de assinatura com status 'pending'.
   * O plano só é ativado após aprovação manual do admin.
   */
  async processCheckout(plan: PlanType): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const payload = {
        plan,
        status: 'pending' as SubscriptionStatus, // Aguarda aprovação manual do admin
        subscription_id: null,
        started_at: new Date().toISOString(),
        next_billing_date: null, // Será definido pelo admin ao aprovar
        updated_at: new Date().toISOString()
      };

      // Atualiza ou insere na tabela subscriptions
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({ user_id: user.id, ...payload }, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao atualizar assinatura:', error);
        return { success: false, error: error.message };
      }

      return { success: true, subscription: data as Subscription };
    } catch (err: any) {
      console.error('Erro ao ativar plano:', err);
      return { success: false, error: err.message || 'Erro interno' };
    }
  },

  /**
   * Cancela a assinatura atual
   */
  async cancelSubscription(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled' as SubscriptionStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) return { success: false, error: error.message };

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
