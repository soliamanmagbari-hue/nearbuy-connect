-- Create analytics tables for tracking business metrics
CREATE TABLE public.business_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'call', 'offer_click', 'profile_view'
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.business_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Business owners can view their analytics" 
ON public.business_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM businesses 
  WHERE businesses.id = business_analytics.business_id 
  AND businesses.user_id = auth.uid()
));

CREATE POLICY "Analytics can be inserted by anyone" 
ON public.business_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_business_analytics_business_id ON public.business_analytics(business_id);
CREATE INDEX idx_business_analytics_event_type ON public.business_analytics(event_type);
CREATE INDEX idx_business_analytics_created_at ON public.business_analytics(created_at);

-- Add foreign key constraint
ALTER TABLE public.business_analytics 
ADD CONSTRAINT fk_business_analytics_business_id 
FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;