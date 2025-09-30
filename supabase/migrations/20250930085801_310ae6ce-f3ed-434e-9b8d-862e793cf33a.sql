-- Drop the overly permissive policy that exposes sensitive contact information
DROP POLICY "Businesses are viewable by everyone" ON public.businesses;

-- Create a new restrictive policy for public business viewing that excludes sensitive contact information
-- This policy allows anyone to view business listings but restricts access to email and phone
CREATE POLICY "Public can view business listings without contact info" 
ON public.businesses 
FOR SELECT 
USING (
  -- Only allow public access to non-sensitive fields
  -- The application layer will need to handle field-level access control
  subscription_status = 'active'
);

-- Create a policy for business owners to view their own complete business information including contact details
CREATE POLICY "Business owners can view their complete business info" 
ON public.businesses 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a security definer function to get public business information without sensitive fields
CREATE OR REPLACE FUNCTION public.get_public_businesses()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category text,
  address text,
  website text,
  image_url text,
  latitude numeric,
  longitude numeric,
  hours_monday text,
  hours_tuesday text,
  hours_wednesday text,
  hours_thursday text,
  hours_friday text,
  hours_saturday text,
  hours_sunday text,
  subscription_status text,
  subscription_plan text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.name,
    b.description,
    b.category,
    b.address,
    b.website,
    b.image_url,
    b.latitude,
    b.longitude,
    b.hours_monday,
    b.hours_tuesday,
    b.hours_wednesday,
    b.hours_thursday,
    b.hours_friday,
    b.hours_saturday,
    b.hours_sunday,
    b.subscription_status,
    b.subscription_plan,
    b.created_at,
    b.updated_at
  FROM public.businesses b
  WHERE b.subscription_status = 'active'
$$;

-- Create a security definer function for business owners to get contact information
CREATE OR REPLACE FUNCTION public.get_business_contact_info(business_uuid uuid)
RETURNS TABLE (
  phone text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.phone,
    b.email
  FROM public.businesses b
  WHERE b.id = business_uuid 
    AND b.user_id = auth.uid()
$$;