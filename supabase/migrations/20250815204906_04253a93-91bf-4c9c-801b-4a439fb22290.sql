-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create RLS policies for media bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their uploads" ON storage.objects
FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to media files" ON storage.objects
FOR SELECT USING (bucket_id = 'media');