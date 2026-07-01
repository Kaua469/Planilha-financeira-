import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase com service_role — acesso total, bypassa RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Verifica o secret do admin
    const secret = req.headers.get('x-admin-secret');
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id é obrigatório' }, { status: 400 });
    }

    // Verifica se existe assinatura pendente para este usuário
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: 'Nenhuma assinatura encontrada para este usuário' }, { status: 404 });
    }

    if (existing.status !== 'pending') {
      return NextResponse.json({
        error: `Assinatura não está pendente. Status atual: ${existing.status}`
      }, { status: 400 });
    }

    // Calcula data de renovação (1 mês a partir de agora)
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Ativa a assinatura
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        next_billing_date: nextBillingDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Plano ${existing.plan} ativado com sucesso para o usuário ${user_id}`,
      subscription: updated,
      next_billing_date: nextBillingDate.toISOString(),
    });

  } catch (err: any) {
    console.error('[admin/approve-subscription]', err);
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}

// Endpoint GET para listar assinaturas pendentes
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq('status', 'pending')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pending: data, count: data?.length ?? 0 });
}
