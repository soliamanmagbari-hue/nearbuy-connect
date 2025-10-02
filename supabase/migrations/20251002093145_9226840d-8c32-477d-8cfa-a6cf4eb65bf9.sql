-- Create table for business AI training content
CREATE TABLE public.business_ai_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_ai_content ENABLE ROW LEVEL SECURITY;

-- Business owners can manage their AI content
CREATE POLICY "Business owners can manage their AI content"
ON public.business_ai_content
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_ai_content.business_id
    AND businesses.user_id = auth.uid()
  )
);

-- Public can view AI content for active businesses
CREATE POLICY "Public can view AI content for active businesses"
ON public.business_ai_content
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE businesses.id = business_ai_content.business_id
    AND businesses.subscription_status = 'active'
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_business_ai_content_updated_at
BEFORE UPDATE ON public.business_ai_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();