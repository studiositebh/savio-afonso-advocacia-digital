import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SEOHead = ({ title, description, canonical, ogImage, noindex = false }: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Meta description
    updateMetaTag('description', description);
    
    // Robots
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }
    if (canonical) {
      updateMetaTag('og:url', canonical, true);
    }

    // Twitter
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }
  }, [title, description, canonical, ogImage, noindex]);

  return null;
};

export default SEOHead;
