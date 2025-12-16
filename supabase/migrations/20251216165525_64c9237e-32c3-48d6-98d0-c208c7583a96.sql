-- Add type column to categories to distinguish between news and article categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS type text DEFAULT 'article';

-- Update existing categories with appropriate types
-- Article categories
UPDATE categories SET type = 'article' WHERE slug IN ('tributario', 'societario', 'trabalhista', 'compliance', 'comercio-exterior');

-- News categories  
UPDATE categories SET type = 'news' WHERE slug IN ('direito-civil', 'direito-penal', 'direito-trabalhista', 'geral');

-- Insert additional news categories
INSERT INTO categories (name, slug, description, type)
VALUES 
  ('Legislação', 'legislacao', 'Notícias sobre legislação e regulamentação', 'news'),
  ('Jurisprudência', 'jurisprudencia', 'Notícias sobre decisões judiciais', 'news'),
  ('Mercado', 'mercado', 'Notícias sobre mercado jurídico', 'news'),
  ('Economia', 'economia', 'Notícias sobre economia e negócios', 'news')
ON CONFLICT (slug) DO UPDATE SET type = EXCLUDED.type;