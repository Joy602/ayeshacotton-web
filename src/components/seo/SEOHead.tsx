import React, { useEffect } from 'react';
import { Product, StoreSettings } from '../../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  category?: string;
  product?: Product | null;
  products?: Product[];
  settings: StoreSettings;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl = window.location.href,
  imageUrl,
  category = 'All',
  product,
  products = [],
  settings,
}) => {
  const baseTitle = 'Ayesha Cotton';
  const siteUrl = window.location.origin;

  // Dynamic dynamic title determination
  let pageTitle = `${baseTitle} | Luxury 3 pcs, Kids & Latest South Asian Designer Collections`;
  if (product) {
    pageTitle = `${product.name} - ${product.category} | ${baseTitle}`;
  } else if (category && category !== 'All') {
    pageTitle = `${category} Collection - Premium South Asian Fashion | ${baseTitle}`;
  } else if (title) {
    pageTitle = `${title} | ${baseTitle}`;
  }

  const pageDescription =
    product?.description ||
    description ||
    'Discover authentic luxury South Asian 3 pcs designer ensembles, kids festive wear, and exclusive latest collections. Fast cash on delivery across Bangladesh.';

  const defaultImage =
    imageUrl ||
    product?.imageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBAuGd514PKxhQWzGKU_gYiKaDFBRgCkQl6vFz3eoVQ30i-BucqfD3qlp-9keCC7zKr70G1o72bQLnprxsZ7eZ4VlyL5lniqZRSqvufB2Us7xl7J3Gqefk9MPh-lUHhPWz1d7PcX4O3JR9mEIavNZrEAEHKhJfShY_S50buOKsEalL_9o7TesK5tNlzTpU0SOX_6GKBGZhZv5SP0fHUvK5GJgqbi9UF7ci532uR7LXC-ARf1rdTTEZt';

  useEffect(() => {
    // 1. Update Document Title
    document.title = pageTitle;

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attributeName = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attributeName}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard SEO Tags
    updateMeta('description', pageDescription);
    updateMeta('keywords', 'ayesha cotton, 3 piece suit, pakistani lawn, stitched suit, unstitched lawn, eid collection 2026, silk dupatta, luxury organza, kids festive wear, cash on delivery dhaka');
    updateMeta('author', 'Ayesha Cotton');
    updateMeta('robots', 'index, follow, max-image-preview:large');

    // Open Graph Tags
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', defaultImage, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', product ? 'product' : 'website', true);
    updateMeta('og:site_name', settings.storeName, true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', defaultImage);

    // Canonical link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured Data (JSON-LD)
    const storeSchema = {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: settings?.storeName || 'Ayesha Cotton',
      description: 'Curating luxury 3 pcs designer ensembles, handcrafted kids festive wear, and exclusive latest arrivals boutique collections.',
      url: siteUrl,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgz6pUlYTwN6r_3QOdniN5ictgxACX3qWCRTv_5cMdkiX1laWC07vFWT8M2ngV7Y1M07tyRtv6naptC5AVIuinIAx19ooACI4D4Gi2TSVkRh0wQYvBvinftHb5vxNJfkMXvfB-ilwUoxM32PhIqejCavh4fu6J9XxTpZA43c1N4KgV7TjH4-irMRDBhbBYwcfbDSet_DcAkVpQ4Y1qNU4yFXwAvVttRYUUMuJuCcIANw5AiiFmq-Eu',
      telephone: settings?.whatsappNumber || '+8801712679721',
      email: settings?.supportEmail || 'support@ayeshacotton.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings?.address || 'House 24, Road 7, Sector 3, Uttara, Dhaka, Bangladesh',
        addressCountry: 'BD',
      },
      priceRange: '৳৳ - ৳৳৳',
      currenciesAccepted: 'BDT',
      paymentAccepted: 'Cash on Delivery, Mobile Banking',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '22:00',
        },
      ],
    };

    const breadcrumbsSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        ...(category !== 'All'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: `${category} Collection`,
                item: `${siteUrl}?category=${encodeURIComponent(category)}`,
              },
            ]
          : []),
        ...(product
          ? [
              {
                '@type': 'ListItem',
                position: category !== 'All' ? 3 : 2,
                name: product.name,
                item: `${siteUrl}?product=${encodeURIComponent(product.sku)}`,
              },
            ]
          : []),
      ],
    };

    // Product specific schema
    const productSchema = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: [product.imageUrl],
          description: product.description,
          sku: product.sku,
          brand: {
            '@type': 'Brand',
            name: settings.storeName,
          },
          category: product.category,
          material: product.fabricDetails,
          offers: {
            '@type': 'Offer',
            url: `${siteUrl}?product=${encodeURIComponent(product.sku)}`,
            priceCurrency: 'BDT',
            price: product.price,
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability:
              product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: settings.storeName,
            },
          },
        }
      : null;

    // Remove existing json-ld scripts added by our SEO component
    const oldScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
    oldScripts.forEach((s) => s.remove());

    const injectScript = (data: object, id: string) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.id = id;
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    injectScript(storeSchema, 'schema-store');
    injectScript(breadcrumbsSchema, 'schema-breadcrumbs');
    if (productSchema) {
      injectScript(productSchema, 'schema-product');
    }
  }, [pageTitle, pageDescription, defaultImage, canonicalUrl, product, category, settings]);

  return null;
};
