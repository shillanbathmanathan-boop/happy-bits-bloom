import { useEffect } from "react";

const SITE_NAME = "DroneHire Malaysia";
const SITE_URL = "https://happy-bits-bloom.lovable.app";
const DEFAULT_DESCRIPTION = "Find and hire CAAM-certified drone pilots across Malaysia for aerial photography, mapping, inspection, and more.";
const DEFAULT_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/38e9dcb4-0348-4550-885f-1fb3febc4971/id-preview-53dcabf3--9b44ebfe-7763-4662-9bee-2765ef5e7064.lovable.app-1775858174584.png";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  type?: "website" | "profile" | "article";
  jsonLd?: Record<string, any>;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const SEO = ({ title, description, image, canonicalPath, type = "website", jsonLd }: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || DEFAULT_IMAGE;
    const canonical = canonicalPath
      ? `${SITE_URL}${canonicalPath}`
      : `${SITE_URL}${window.location.pathname}`;

    // Title
    document.title = fullTitle;

    // Canonical
    setCanonical(canonical);

    // Standard meta
    setMeta("name", "description", desc);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", img);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", type);

    // Twitter
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    // JSON-LD
    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const el = document.querySelector('script[data-seo-jsonld]');
      if (el) el.remove();
    };
  }, [title, description, image, canonicalPath, type, jsonLd]);

  return null;
};

export default SEO;
