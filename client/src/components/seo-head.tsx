import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

function setMeta(property: string, content: string, useProperty = false) {
  const attr = useProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function SEOHead({ title, description, ogTitle, ogDescription, ogImage, ogUrl }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    if (description) setMeta("description", description);
    setMeta("og:title", ogTitle ?? title, true);
    if (ogDescription ?? description) setMeta("og:description", ogDescription ?? description!, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    if (ogUrl) setMeta("og:url", ogUrl, true);
    setMeta("og:type", "website", true);
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl]);

  return null;
}
