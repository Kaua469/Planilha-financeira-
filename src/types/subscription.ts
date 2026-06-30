export type PlanType = 'free' | 'pro';

export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  subscription_id?: string | null;
  started_at: string;
  next_billing_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  price: string;
  priceValue: number;
  badge?: string;
  features: string[];
  buttonText: string;
}

export const PLAN_DETAILS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Plano Gratuito',
    price: 'R$ 0,00',
    priceValue: 0,
    features: [
      'Até 100 lançamentos por mês',
      'Dashboard básico',
      'Fluxo de caixa básico',
      '1 conta financeira',
      'Suporte por e-mail'
    ],
    buttonText: 'Começar Gratuitamente'
  },
  pro: {
    id: 'pro',
    name: 'Plano Pro',
    price: 'R$ 50,00',
    priceValue: 50,
    badge: '⭐ Mais Popular',
    features: [
      'Lançamentos ilimitados',
      'Contas ilimitadas',
      'Contas a pagar',
      'Contas a receber',
      'Fluxo de caixa completo',
      'Dashboard avançado',
      'Relatórios financeiros',
      'Exportação para PDF',
      'Exportação para Excel',
      'Categorias personalizadas',
      'Backup automático',
      'Metas financeiras',
      'Suporte prioritário'
    ],
    buttonText: 'Assinar Plano Pro'
  }
};
