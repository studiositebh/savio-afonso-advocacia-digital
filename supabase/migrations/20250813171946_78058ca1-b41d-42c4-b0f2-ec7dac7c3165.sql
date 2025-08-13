-- Fix media table security - restrict access to file owners and public files in published posts
DROP POLICY IF EXISTS "Media is viewable by everyone" ON public.media;

-- Allow users to view their own media files
CREATE POLICY "Users can view their own media" 
ON public.media 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow viewing media files that are used in published posts (for public access)
CREATE POLICY "Public can view media used in published posts" 
ON public.media 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.featured_image = media.file_path 
    AND posts.status = 'published'
  )
);

-- Ensure users can only manage their own media files
DROP POLICY IF EXISTS "Users can manage their own media" ON public.media;

CREATE POLICY "Users can insert their own media" 
ON public.media 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media" 
ON public.media 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media" 
ON public.media 
FOR DELETE 
USING (auth.uid() = user_id);