-- Create the properties table in Supabase
-- Run this in your Supabase SQL Editor

-- Create properties table
CREATE TABLE public.properties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    price numeric NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    area integer NOT NULL,
    bedrooms integer NOT NULL,
    bathrooms integer NOT NULL,
    type text NOT NULL,
    title text,
    description text,
    images text[], -- Array of image URLs/paths
    user_id uuid NOT NULL,
    location text,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_country ON public.properties(country);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_is_featured ON public.properties(is_featured);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Users can view all properties
CREATE POLICY "Users can view all properties" ON public.properties
    FOR SELECT TO authenticated USING (true);

-- Users can insert their own properties
CREATE POLICY "Users can insert their own properties" ON public.properties
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own properties
CREATE POLICY "Users can update their own properties" ON public.properties
    FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own properties
CREATE POLICY "Users can delete their own properties" ON public.properties
    FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
