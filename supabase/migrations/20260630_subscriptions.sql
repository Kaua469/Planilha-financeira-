-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'canceled', 'trialing')),
    subscription_id TEXT, -- Payment gateway ID
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user subscription creation (Free by default)
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (new.id, 'free', 'active');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user subscription
CREATE OR REPLACE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Backfill subscriptions for existing users who don't have one
INSERT INTO public.subscriptions (user_id, plan, status)
SELECT id, 'free', 'active'
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
