-- Add new roles to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';